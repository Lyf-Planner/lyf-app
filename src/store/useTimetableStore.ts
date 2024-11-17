import * as Haptics from 'expo-haptics';
import { getCalendars } from 'expo-localization';
import { v4 as uuid } from 'uuid';
import { create } from 'zustand';

import 'react-native-get-random-values';

import { AuthState, useAuthStore } from './useAuthStore';

import { createItem, deleteItem, getTimetable, updateItem as updateRemoteItem, updateItemSocial as updateRemoteItemSocial } from '@/rest/items';
import { ID } from '@/schema/database/abstract';
import { ItemStatus, ItemType } from '@/schema/database/items';
import { Permission } from '@/schema/database/items_on_users';
import { LocalItem } from '@/schema/items';
import { UserRelatedItem } from '@/schema/user';
import { DateString } from '@/schema/util/dates';
import { SocialAction } from '@/schema/util/social';
import { useNoteStore } from '@/store/useNoteStore';
import { getEndDate, getStartDate } from '@/utils/dates';
import { AddItem, RemoveItem, ResortItems, UpdateItem, UpdateItemSocial } from '@/utils/item';

export type TimetableState = {
  items: Record<ID, LocalItem>,

  startDate: DateString,
  endDate: DateString,
  setDateRange: (start: DateString | null, end: DateString | null) => void;

  loading: boolean,
  reload: (start_date?: DateString, end_date?: DateString) => Promise<DateString[]>,

  updateItem: UpdateItem,
  updateItemSocial: UpdateItemSocial,
  addItem: AddItem,
  removeItem: RemoveItem,
  resortItems: ResortItems
}

export const useTimetableStore = create<TimetableState>((set, get) => ({
  items: {},

  startDate: '',
  endDate: '',
  setDateRange: (startDate: DateString | null, endDate: DateString | null) => {
    if (startDate && endDate) {
      set({ startDate, endDate });
    } else if (startDate) {
      set({ startDate })
    } else if (endDate) {
      set({ endDate });
    }
  },

  loading: true,
  reload: async (start_date?: string, end_date?: string) => {
    const { user } = useAuthStore.getState();

    if (!user) {
      set({ items: {} })
      return ['', ''];
    }

    set({ loading: true });
    const start = start_date || get().startDate;
    const end = end_date || get().endDate;

    get().setDateRange(start, end);

    const itemsArray = await getTimetable(user.id, start)

    const items: Record<ID, LocalItem> = {}
    itemsArray.forEach((item: LocalItem) => items[item.id] = item);
    set({ items, loading: false });

    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)
    return [start, end];
  },

  updateItem: async (item: LocalItem, changes: Partial<UserRelatedItem>, updateRemote = true) => {
    const updateStart = new Date();
    console.log('starting probe with zero time', updateStart.getTime())
    const probe = (stage: string) => console.log(new Date().getTime() - updateStart.getTime(), stage);

    if (item.note_id) {
      probe('handling note id update.');
      // Item lives in a different store, send it there for it's local update
      useNoteStore.getState().handleNoteItemUpdate(probe, item, changes)
    } else if (item.localised) {
      probe('creating localised item.')
      // Localised items need to be added to the store as something new
      const createdItem = { ...item, ...changes };
      await get().addItem(createdItem.type, createdItem.sorting_rank, createdItem);
      probe('localised item created.')
      return;
    } else {
      probe('getting in store item')
      const inStoreItem = get().items[item.id];
      if (!inStoreItem) {
        console.error('Cannot update item not held in store ?')
        return;
      }

      // Update store
      const { items } = get();
      set({
        items: {
          ...items,
          [item.id]: {
            ...items[item.id],
            ...changes
          }
        }
      });
      probe('in store item updated')
    }

    if (updateRemote) {
      const success = await updateRemoteItem({ id: item.id, ...changes });
      if (!success) {
        // Fallback to handle failed remote updates
        get().updateItem(item, item, false);
      }
      probe('remote item updated');
    }
  },
  updateItemSocial: async (
    item: LocalItem,
    user_id: string,
    action: SocialAction,
    permission: Permission
  ) => {
    const { user } = useAuthStore();
    const { items, removeItem, updateItem } = get();

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

    const storeItem = items[item.id];
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

    // Use updateItem so we handle things like note items, localised items etc.
    updateItem(item, itemChanges, false)
  },

  addItem: async (
    type: ItemType,
    rank: number,
    initial: Partial<LocalItem>
  ) => {
    const { items } = get();
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

      // Include all fields for reference, satisfying type
      note_id: undefined,
      template_id: undefined,
      date: undefined,
      day: undefined,
      desc: undefined,
      time: undefined,
      end_time: undefined,
      url: undefined,
      location: undefined,
      show_in_upcoming: undefined,
      notification_mins: undefined,

      // Then overwrite with whatever info we do have;
      ...initial,
      localised: false
    };

    // Conditional properties
    if (newItem.title[newItem.title.length - 1] === '?') {
      newItem.status = ItemStatus.Tentative;
    }

    const updateStart = new Date()
    const probe = (stage: string) => console.log(new Date().getTime() - updateStart.getTime(), stage);

    if (newItem.note_id) {
      // Item lives in a different store, send it there for it's local update
      useNoteStore.getState().handleNoteItemUpdate(probe, newItem, {})
    } else {
      set({ items: { ...items, [newItem.id]: newItem } });
    }

    // Upload, update store with result, fallback and remove item if creation failed
    try {
      await createItem(newItem);
    } catch {
      get().removeItem(newItem, false);
    }

    return newItem.id;
  },
  removeItem: async (item: LocalItem, deleteRemote = true) => {
    const { user } = useAuthStore.getState();
    const { items, updateItem, updateItemSocial } = get();

    if (item.template_id) {
      // Dont delete if the item's template is still active (it will look the same) - just mark as cancelled
      const dontDelete = Object.keys(items).find((x) => x === item.template_id);

      if (dontDelete) {
        updateItem(item, { status: ItemStatus.Cancelled }, true);
        return;
      }
    }

    // Items actually get soft deleted, by removing the relation with the user
    if (!item.note_id && item.permission !== Permission.Owner && deleteRemote) {
      await updateItemSocial(item, user!.id, SocialAction.Remove, item.permission);
      return;
    }

    const { id } = item;

    const updateStart = new Date()
    const probe = (stage: string) => console.log(new Date().getTime() - updateStart.getTime(), stage);

    if (item.note_id) {
      useNoteStore.getState().handleNoteItemUpdate(probe, item, {}, true)
    } else {
      // Remove from this store
      const tmp = { ...items };
      delete tmp[item.id];
      set({ items: tmp });
    }

    if (deleteRemote) {
      await deleteItem(id);
    }
  },
  resortItems: async (priorities: LocalItem[]) => {
    const { items, updateItem } = get();

    if (priorities.length === 0) {
      return;
    }

    const tmp = { ...items };
    for (const item of Object.values(items)) {
      const prioritiesIndex = priorities.findIndex((x) => x.id === item.id)

      if (prioritiesIndex !== -1) {
        item.sorting_rank = prioritiesIndex
      }
    }
    set({ items: tmp });

    for (const i in priorities) {
      // Fix any localised items
      if (priorities[i].localised) {
        updateItem(priorities[i], {})
      } else {
        updateRemoteItem({ id: priorities[i].id, sorting_rank: parseInt(i) });
      }
    }
  }
}));

// listeners
useAuthStore.subscribe((state: AuthState, prevState: AuthState) => {
  // initialise dates in response to user login OR first day change
  if (state.user?.first_day !== prevState.user?.first_day) {
    const firstDay = state.user?.first_day;

    const startDate = getStartDate(firstDay);
    const endDate = getEndDate(startDate);
    useTimetableStore.setState({ startDate, endDate });
  }

  // initialise item store in response to authorisation
  if (state.user && !prevState.user) {
    console.log('loading timetable upon authorisation')
    useTimetableStore.getState().reload();
  }
});
