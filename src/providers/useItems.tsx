import { createContext, useContext, useEffect, useState } from 'react';
import { useAuth } from '../authorisation/AuthProvider';
import { getCalendars } from 'expo-localization';
import {
  createItem,
  deleteItem,
  getItems,
  updateItem as updateRemoteItem,
  updateItemSocial as updateRemoteItemSocial
} from '../rest/items';
import { ItemStatus, ListItemType } from '../components/list/constants';
import { v4 as uuid } from 'uuid';
import { formatDateData, getStartOfCurrentWeek } from '../utils/dates';
import { SocialAction, arraysEqualAsSets } from '../utils/constants';
import 'react-native-get-random-values';
import { ListItem } from '../utils/abstractTypes';

export type AddItem = (
  title: string,
  type: ListItemType,
  date: string,
  day: string,
  status?: ItemStatus,
  template_instance?: ListItem
) => void;
export type UpdateItem = (item: ListItem, updateRemote?: boolean) => void;
export type UpdateItemSocial = (
  item: ListItem,
  user_id: string,
  action: SocialAction
) => void;
export type RemoveItem = (item: ListItem, deleteRemote?: boolean) => void;
export type ResortItems = (priorities: string[]) => void;

type Props = {
  children: JSX.Element;
}

// Assisted state management via provider
export const ItemsProvider = ({ children }: Props) => {
  const [items, setItems] = useState([]);
  const [syncing, setSyncing] = useState(true);
  const { user, updateUser } = useAuth();

  // Timetable needs to fetch all the list item ids before anything else
  useEffect(() => {
    if (!user) {
      return;
    }
    const itemIds = user.timetable.items.map((x) => x.id);
    let inviteIds = user.timetable.invited_items;

    // Remove any invites accepted as items from the invite list
    inviteIds = inviteIds.filter((x) => !itemIds.includes(x));
    const fetchedIds = itemIds.concat(inviteIds);
    const storeIds = items.map((x) => x.id);

    const itemChanges = !arraysEqualAsSets(fetchedIds, storeIds);
    console.log('Item Changes Detected?', itemChanges);

    if (itemChanges) {
      console.log('Syncing Item Store');
      for (const item of fetchedIds) {
        if (!syncing && !storeIds.includes(item)) {
          console.warn('User is missing the item', item);
        }
      }
      setSyncing(true);

      getItems(fetchedIds).then((results) => {
        // Filter out any old items
        const start = formatDateData(getStartOfCurrentWeek());
        const relevant = results.filter((x) => {
          return !x.date || x.date.localeCompare(start) >= 0;
        });

        setItems(relevant);

        purgeIrrelevantItems(relevant, fetchedIds);
        setSyncing(false);
      });
    } else {
      setSyncing(false);
    }
  }, [user]);

  const purgeIrrelevantItems = (relevant, fetchedIds) => {
    // Remove items from user that no longer exist or are old - appears as a background task
    if (
      !arraysEqualAsSets(
        relevant.map((x) => x.id),
        fetchedIds
      )
    ) {
      const relevant_ids = relevant.map((x) => x.id);
      const fresh_items = user.timetable.items.filter((x) =>
        relevant_ids.includes(x.id)
      );
      const fresh_invites = user.timetable.invited_items.filter((x) =>
        relevant_ids.includes(x)
      );

      updateUser({
        ...user,
        timetable: {
          ...user.timetable,
          items: fresh_items,
          invited_items: fresh_invites
        }
      });
    }
  };

  const updateItem = async (item, updateRemote = true) => {
    const invited =
      item.invited_users && item.invited_users.find((x) => x === user.id);
    if (invited) {
      return;
    }

    // We create localised instances of templates in the planner - if this is one of those then create it
    if (item.localised) {
      console.log('Local item will be created instead of updated');
      addItem(null, null, null, null, null, item);
      return;
    }

    // Update store
    const tmp = [...items];
    const i = tmp.findIndex((x) => x.id === item.id);
    const before = tmp[i];
    tmp[i] = item;
    tmp.length === 0 && console.error('UPDATE REMOVING ITEMS');
    setItems(tmp);

    if (updateRemote) {
      const success = await updateRemoteItem(item);
      if (!success) {
        tmp[i] = before;
        setItems(tmp);
      }
    }
  };

  const addItem = async (
    title: string,
    type: ListItemType,
    date: string,
    day: string,
    status: ItemStatus = ItemStatus.Upcoming,
    // Template instance is a whole list item
    template_instance?: ListItem
  ) => {
    if (template_instance) {
      var newItem = { ...template_instance };
      delete newItem.localised;
    } else {
      var newItem = {
        id: uuid(),
        title,
        type,
        tz: getCalendars()[0].timeZone,
        date,
        day,
        permitted_users: [
          {
            user_id: user.id,
            displayed_as: user.details?.name || user.id,
            permissions: 'Owner'
          }
        ],
        notifications: [],
        status
      } as any;
    }

    // Add to store
    const tmpItems = [...items];

    // Conditional properties
    if (newItem.title[newItem.title.length - 1] === '?') {
      newItem.status = ItemStatus.Tentative;
    }

    // Template instances get inserted after their template to preserve orderings!
    if (template_instance) {
      const templateIndex = tmpItems.findIndex(
        (x) => x.id === newItem.template_id
      );
      tmpItems.splice(templateIndex, 0, newItem);
    } else {
      tmpItems.push(newItem);
    }

    setItems(tmpItems);

    // Add ref to user
    const tmpUser = user;
    tmpUser.timetable.items.push({ id: newItem.id });
    updateUser(tmpUser);

    // Upload in background
    createItem(newItem);
  };

  const updateItemSocial = async (item, user_id, action) => {
    const result = await updateRemoteItemSocial(item.id, user_id, action);
    if (!result) {
      return;
    }

    // If user removed themselves, delete from linked items
    if (
      (action === SocialAction.Remove || action === SocialAction.Decline) &&
      user_id === user.id
    ) {
      // Remove from items and user
      await removeItem(item, false);
    } else {
      await updateItem({ ...item, ...result }, false);
    }
  };

  const removeItem = async (item, deleteRemote = true) => {
    if (item.template_id) {
      // Dont delete if item template is still active (it will look the same) - just mark as cancelled
      const dontDelete = items
        .map((x) => x.id)
        .find((x) => x === item.template_id);
      if (dontDelete) {
        updateItem({ ...item, status: ItemStatus.Cancelled });
        return;
      }
    }

    const { id } = item;
    // Remove from this store
    let tmp = items.filter((x) => x.id !== id) as any;
    setItems(tmp);

    // Remove ref from user
    tmp = user;
    tmp.timetable.items = tmp.timetable.items.filter((x) => x.id !== id);
    updateUser(tmp);

    if (deleteRemote) {
      await deleteItem(id);
    }
  };

  const resortItems = (priorities: string[]) => {
    const sortedItems = items.sort(
      (a, b) => priorities.indexOf(a.id) - priorities.indexOf(b.id)
    );

    setItems(sortedItems);

    updateUser({
      ...user,
      timetable: {
        ...user.timetable,
        items: sortedItems.map((x) => ({ id: x.id }))
      }
    });
  };

  const EXPOSED = {
    syncing,
    items,
    updateItem,
    updateItemSocial,
    addItem,
    removeItem,
    resortItems
  };

  return (
    <ItemsContext.Provider value={EXPOSED}>{children}</ItemsContext.Provider>
  );
};

const ItemsContext = createContext(null);

type TemplateInstance = {
  id: string;
  template_id: string;
  permitted_users: any[];
  time?: string;
};

export const useItems = () => {
  return useContext(ItemsContext);
};
