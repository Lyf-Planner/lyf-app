import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { useAuth } from 'providers/cloud/useAuth';
import { getCalendars } from 'expo-localization';
import {
  createItem,
  deleteItem,
  getItem,
  getTimetable,
  getWeather,
  updateItem as updateRemoteItem,
  updateItemSocial as updateRemoteItemSocial
} from 'rest/items';
import { ItemStatus } from 'components/list/constants';
import { v4 as uuid } from 'uuid';
import { addWeekToStringDate, formatDateData, getEndOfCurrentWeek, getStartOfCurrentWeek } from 'utils/dates';
import 'react-native-get-random-values';
import { PublicUser, UserRelatedItem } from 'schema/user';
import { Item, LocalItem } from 'schema/items';
import { ItemDbObject, ItemType } from 'schema/database/items';
import { Permission } from 'schema/database/items_on_users';
import { SocialAction } from 'schema/util/social';
import { ID } from 'schema/database/abstract';
import { DateString } from 'schema/util/dates';
import { useCloud } from './cloudProvider';
import { useNotes } from './useNotes';
import { DailyWeather, HistoricalWeather } from 'openweather-api-node';
import { useLocation } from './useLocation';

export type TimetableHooks = {
  startDate: DateString,
  endDate: DateString,
  loading: boolean,
  items: LocalItem[],
  weather: (DailyWeather | HistoricalWeather)[] | null,
  updateItem: UpdateItem,
  updateItemSocial: UpdateItemSocial,
  addItem: AddItem,
  reload: (start_date?: DateString, end_date?: DateString) => Promise<DateString[]>,
  removeItem: RemoveItem,
  resortItems: ResortItems
}

export type AddItem = (
  type: ItemType,
  rank: number,
  initial: Partial<LocalItem>,
) => Promise<ID>;
export type UpdateItem = (item: LocalItem, changes: Partial<UserRelatedItem>, updateRemote?: boolean) => Promise<void>;
export type UpdateItemSocial = (
  item: LocalItem,
  user_id: string,
  action: SocialAction,
  permission: Permission
) => Promise<void>;
export type RemoveItem = (item: LocalItem, deleteRemote?: boolean) => Promise<void>;
export type ResortItems = (priorities: LocalItem[], moved_index: number) => void;

type Props = {
  children: JSX.Element;
}

/**
 * Store for all data related to timetable
 */
export const TimetableProvider = ({ children }: Props) => {
  const { user } = useAuth()
  const { location } = useLocation();
  const { handleNoteItemUpdate } = useNotes();
  const { setSyncing } = useCloud();

  const [initialised, setInitialised] = useState(false);
  const [loading, setLoading] = useState(true);

  const [items, setItems] = useState<LocalItem[]>([]);
  const [weather, setWeather] = useState<(HistoricalWeather | DailyWeather)[] | null>(null);

  const [startDate, setStartDate] = useState(formatDateData(getStartOfCurrentWeek()));
  const [endDate, setEndDate] = useState(formatDateData(getEndOfCurrentWeek()));

  useEffect(() => {
    if (location && user && user.weather_data) {
      getWeather(startDate, endDate, location).then((data) => {
        setWeather(data)
      })
    }
  }, [startDate, endDate, location])

  // Timetable needs to fetch all the list item ids before anything else
  const reload = useCallback(async (start_date?: string, end_date?: string) => {
    if (!user) {
      setItems([])
      return ['', ''];
    }

    if (!initialised) {
      setLoading(true);
    } else {
      setSyncing(true);
    }

    const start = start_date || startDate;
    const end = end_date || endDate;

    setStartDate(start)
    setEndDate(end);
  
    const items = await getTimetable(user.id, start)

    setItems(items);

    if (!initialised) {
      setLoading(false);
      setInitialised(true);
    } else {
      setSyncing(false);
    }

    return [start, end];
  }, [user])

  const updateItem = async (item: LocalItem, changes: Partial<UserRelatedItem>, updateRemote = true) => {
    if (item.note_id) {
      // Item lives in a different store, send it there for it's local update
      handleNoteItemUpdate(item, changes)
    } else if (item.localised) {
      // Localised items need to be added to the store as something new
      const createdItem = { ...item, ...changes };
      addItem(createdItem.type, createdItem.sorting_rank, createdItem);
      return;
    } else {
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
    }

    if (updateRemote) {
      const success = await updateRemoteItem({ id: item.id, ...changes });
      if (!success) {
        // Fallback to handle failed remote updates
        updateItem(item, item, false);
      }
    }
  };

  const addItem: AddItem = async (
    type: ItemType,
    rank: number,
    initial: Partial<LocalItem>,
  ) => {
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

      // Then overwrite with whatever info we do have;
      ...initial,
      localised: false,
    };

    // Conditional properties
    if (newItem.title[newItem.title.length - 1] === '?') {
      newItem.status = ItemStatus.Tentative;
    }

    if (newItem.note_id) {
      // Item lives in a different store, send it there for it's local update
      handleNoteItemUpdate(newItem, {})
    } else {
      setItems([...items, newItem]);
    }

    // Upload, update store with result
    await createItem(newItem);

    return newItem.id;
  };

  const updateItemSocial: UpdateItemSocial = async (
    item: LocalItem, 
    user_id: string, 
    action: SocialAction, 
    permission: Permission
  ) => {
    const result = await updateRemoteItemSocial(item.id, user_id, action, permission);
    if (result === false) {
      return;
    }

    const leavingItem = user_id === user?.id && action === SocialAction.Remove;
    if (leavingItem) {
      await removeItem(item, false);
      return;
    }

    const destructiveAction = 
      action === SocialAction.Remove || 
      action === SocialAction.Decline ||
      action === SocialAction.Cancel;

    const i = items.findIndex((x) => x.id === item.id);

    const storeItem = items[i];
    const itemUsers = storeItem.relations.users || [];
    const j = itemUsers.findIndex((x) => x.id === user_id);

    if (j === -1 && !destructiveAction) {
      // Create
      itemUsers.push(result);
    } else if (destructiveAction) {
      // Delete
      itemUsers.splice(j, 1);
    } else {
      // Update
      itemUsers[j] = { ...itemUsers[j], ...result };
    }

    const itemChanges: Partial<LocalItem> = { 
      relations: { ...item.relations, users: itemUsers },
      // Some manual sneakys for local state
      collaborative: itemUsers.length > 1,
      invite_pending: false
    }

    updateItem(item, itemChanges, false)
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

    if (item.permission !== Permission.Owner && deleteRemote) {
      await updateItemSocial(item, user!.id, SocialAction.Remove, item.permission);
      return;
    }

    const { id } = item;

    if (item.note_id) {
      handleNoteItemUpdate(item, {}, true)
    } else {
      // Remove from this store
      const tmp = items.filter((x) => x.id !== id);
      setItems(tmp);
    }

    if (deleteRemote) {
      await deleteItem(id);
    }
  };

  const resortItems: ResortItems = (priorities: LocalItem[], moved_index: number) => {
    if (priorities.length === 0) {
      return;
    }

    const tmp = [...items];
    for (const item of tmp) {
      const prioritiesIndex = priorities.findIndex((x) => x.id === item.id)

      if (prioritiesIndex !== -1) {
        item.sorting_rank = prioritiesIndex
      }
    }
    setItems(tmp);
  
    for (const i in priorities) {
      updateRemoteItem({ id: priorities[i].id, sorting_rank: parseInt(i) });
    }
  };

  const exposed: TimetableHooks = {
    startDate,
    endDate,
    loading,
    items,
    weather,
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
