import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { useAuth } from 'providers/cloud/useAuth';
import * as Haptics from 'expo-haptics';
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
import { ItemStatus } from 'components/item/constants';
import { v4 as uuid } from 'uuid';
import { addDayToStringDate, formatDateData, getStartOfCurrentWeek, parseDateString } from 'utils/dates';
import 'react-native-get-random-values';
import { UserRelatedItem } from 'schema/user';
import { LocalItem } from 'schema/items';
import { ItemType } from 'schema/database/items';
import { Permission } from 'schema/database/items_on_users';
import { SocialAction } from 'schema/util/social';
import { ID } from 'schema/database/abstract';
import { DateString, WeekDays } from 'schema/util/dates';
import { useCloud } from './cloudProvider';
import { useNotes } from './useNotes';
import { DailyWeather, HistoricalWeather } from 'openweather-api-node';
import { useLocation } from './useLocation';
import { AppState } from 'react-native';

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
export type ResortItems = (priorities: LocalItem[]) => void;

type Props = {
  children: JSX.Element;
}

/**
 * Store for all data related to timetable
 */
export const TimetableProvider = ({ children }: Props) => {
  const [lastActive, setLastActive] = useState(new Date());

  const { user } = useAuth()
  const { location } = useLocation();
  const { handleNoteItemUpdate } = useNotes();
  const { setSyncing } = useCloud();

  const [initialised, setInitialised] = useState(false);
  const [loading, setLoading] = useState(true);

  const [items, setItems] = useState<LocalItem[]>([]);
  const [weather, setWeather] = useState<(HistoricalWeather | DailyWeather)[] | null>(null);

  const getStartDate = () => {
    const startOfWeek = getStartOfCurrentWeek();
    const userFirstDay = user?.first_day ? parseDateString(user?.first_day) : startOfWeek;

    let appliedFirstDay = userFirstDay;
    if (userFirstDay.getTime() < startOfWeek.getTime()) {
      appliedFirstDay = startOfWeek;
    }
  
    return formatDateData(appliedFirstDay);
  }

  const getEndDate = () => {
    return addDayToStringDate(getStartDate(), WeekDays.length - 1);
  }

  const [startDate, setStartDate] = useState(getStartDate());
  const [endDate, setEndDate] = useState(getEndDate());

  useEffect(() => {
    if (location && user && user.weather_data) {
      getWeather(startDate, endDate, location).then((data) => {
        setWeather(data)
      })
    }
  }, [startDate, endDate, location])

  // Sync the timetable again if inactivity lasts 2 mins+
  useEffect(() => {
    const appStateListener = AppState.addEventListener("change", (state) => {
      const appStateChangeTime = new Date();
      const inactivityPeriod = appStateChangeTime.getTime() - lastActive.getTime();

      // Reload if inactive for > 2 mins and entering active state
      console.log('App was last active:', inactivityPeriod / 1000, 'seconds ago')
      if (inactivityPeriod > 2 * 60 * 1000 && state === 'active') {
        reload();
      }

      setLastActive(appStateChangeTime);
      console.log(`App ${state} at ${appStateChangeTime}`);
    });

    return () => appStateListener.remove();
  }, [lastActive]);

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

    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)
    return [start, end];
  }, [user])

  useEffect(() => {
    reload()
  }, [])

  const updateItem = async (item: LocalItem, changes: Partial<UserRelatedItem>, updateRemote = true) => {
    if (item.note_id) {
      // Item lives in a different store, send it there for it's local update
      handleNoteItemUpdate(item, changes)
    } else if (item.localised) {
      // Localised items need to be added to the store as something new
      const createdItem = { ...item, ...changes };
      await addItem(createdItem.type, createdItem.sorting_rank, createdItem);
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

    if (!item.note_id && item.permission !== Permission.Owner && deleteRemote) {
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

  const resortItems: ResortItems = async (priorities: LocalItem[]) => {
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
      // Fix any localised items
      if (priorities[i].localised) {
        updateItem(priorities[i], {})
      } else {
        updateRemoteItem({ id: priorities[i].id, sorting_rank: parseInt(i) });
      }
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
