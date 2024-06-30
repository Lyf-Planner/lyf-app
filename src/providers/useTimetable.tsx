import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { useAuth } from '../authorisation/AuthProvider';
import { getCalendars } from 'expo-localization';
import {
  createItem,
  deleteItem,
  getTimetable,
  updateItem as updateRemoteItem,
  updateItemSocial as updateRemoteItemSocial
} from '../rest/items';
import { ItemStatus } from '../components/list/constants';
import { v4 as uuid } from 'uuid';
import { addWeekToStringDate, formatDateData, getStartOfCurrentWeek } from '../utils/dates';
import 'react-native-get-random-values';
import { ListItem } from '../utils/abstractTypes';
import { PublicUser, UserRelatedItem } from 'schema/user';
import { Item, LocalItem } from '../schema/items';
import { ItemDbObject, ItemType } from '../schema/database/items';
import { Permission } from '../schema/database/items_on_users';
import { SocialAction } from '../schema/util/social';
import { ID } from '../schema/database/abstract';

export type TimetableHooks = {
  loading: boolean,
  items: LocalItem[],
  updateItem: UpdateItem,
  updateItemSocial: UpdateItemSocial,
  addItem: AddItem,
  reload: () => Promise<void>,
  removeItem: RemoveItem,
  resortItems: ResortItems
}

export type AddItem = (
  type: ItemType,
  rank: number,
  initial: Partial<LocalItem>,
) => Promise<void>;
export type UpdateItem = (item: LocalItem, changes: Partial<UserRelatedItem>, updateRemote?: boolean) => Promise<void>;
export type UpdateItemSocial = (
  item: ListItem,
  user_id: string,
  action: SocialAction,
  permission?: Permission
) => Promise<void>;
export type RemoveItem = (item: ListItem, deleteRemote?: boolean) => Promise<void>;
export type ResortItems = (priorities: ID[]) => void;

type Props = {
  children: JSX.Element;
}

/**
 * Store for all data related to timetable
 */
export const TimetableProvider = ({ children }: Props) => {
  const { user } = useAuth()

  const [items, setItems] = useState<LocalItem[]>([]);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("")
  const [loading, setLoading] = useState(true);
  

  // Timetable needs to fetch all the list item ids before anything else
  const reload = useCallback(async (start_date?: string, end_date?: string) => {
    if (!user) {
      return;
    }

    const start = start_date || startDate || user.first_day || formatDateData(new Date());
    const end = end_date || endDate || addWeekToStringDate(start);
    setStartDate(start)
    setEndDate(end);

    setLoading(true)
    const items = await getTimetable(user.id, start);
    setItems(items);
    setLoading(false);
  }, [user])

  const updateItem = async (item: LocalItem, changes: Partial<UserRelatedItem>, updateRemote = true) => {
    // We create localised instances of templates in the planner - if this is one of those then create it
    console.log("updating item", item);
    if (item.localised) {
      console.log('Local item will be created instead of updated');
      await addItem(item.type, item.sorting_rank, { ...item, ...changes});
      return;
    }

    const inStoreItem = items.find((x) => x.id === item.id);
    if (!inStoreItem) {
      console.error("Cannot update item not held in store ?")
      return;
    }

    // Update store
    const tmp = [...items];
    const i = tmp.findIndex((x) => x.id === item.id);
    tmp[i] = { ...item, ...changes };
  
    setItems(tmp);

    if (updateRemote) {
      const success = await updateRemoteItem({ id: item.id, ...changes });
      if (!success) {
        // Fallback to handle failed remote updates
        tmp[i] = item;
        setItems(tmp);
      }
    }
  };

  const addItem: AddItem = async (
    type: ItemType,
    rank: number,
    initial: Partial<LocalItem>,
  ) => {
    console.log('creating item with overridden values:', initial);

    const newItem: LocalItem = {
      // Set defaults
      id: uuid(),
      created: new Date(),
      last_updated: new Date(),
      title: `Untitled ${type}`,
      collaborative: false,
      status: ItemStatus.Upcoming,
      type,
      tz: getCalendars()[0].timeZone || 'Australia/Melbourne',
      invite_pending: false,
      permission: Permission.Owner,
      sorting_rank: rank,
      relations: {},
      localised: false,

      // Then overwrite with whatever info we do have;
      ...initial
    };

    // Conditional properties
    if (newItem.title[newItem.title.length - 1] === '?') {
      newItem.status = ItemStatus.Tentative;
    }

    setItems([...items, newItem]);

    // Upload in background
    createItem(newItem);
  };

  const updateItemSocial: UpdateItemSocial = async (
    item: UserRelatedItem, 
    user_id: string, 
    action: SocialAction, 
    permission?: Permission
  ) => {
    const result = await updateRemoteItemSocial(item.id, user_id, action, permission);
    if (!result) {
      return;
    }

    // If user removed themselves, delete from linked items
    const destructiveAction = action === SocialAction.Remove || action === SocialAction.Decline
    if (destructiveAction && user_id === user!.id
    ) {
      // Remove from items and user
      removeItem(item, false);
    }

    return result;
  };

  const removeItem: RemoveItem = async (item: LocalItem, deleteRemote = true) => {
    if (item.template_id) {
      // Dont delete if item template is still active (it will look the same) - just mark as cancelled
      const dontDelete = items
        .map((x) => x.id)
        .find((x) => x === item.template_id);

      if (dontDelete) {
        updateItem(item, { status: ItemStatus.Cancelled }, true);
        return;
      }
    }

    const { id } = item;
    // Remove from this store
    let tmp = items.filter((x) => x.id !== id) as any;
    setItems(tmp);

    if (deleteRemote) {
      await deleteItem(id);
    }
  };

  const resortItems: ResortItems = (priorities: ID[]) => {
    for (const i in priorities) {
      const item = items.find((x) => x.id === priorities[i]);
      
      if (item) {
        updateItem(item, { sorting_rank: parseInt(i) }, true)
      }
    }
  };

  const exposed: TimetableHooks = {
    loading,
    items,
    updateItem,
    updateItemSocial,
    addItem,
    reload,
    removeItem,
    resortItems
  };

  return (
    <TimetableContext.Provider value={exposed}>{children}</TimetableContext.Provider>
  );
};

const TimetableContext = createContext<TimetableHooks>(undefined as any); // TODO unfuck this

export const useTimetable = () => {
  return useContext(TimetableContext);
};
