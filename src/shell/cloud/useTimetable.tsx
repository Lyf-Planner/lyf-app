import { createContext, useContext, useEffect, useState } from 'react';
import { AppState } from 'react-native';

import 'react-native-get-random-values';

import { ID } from '@/schema/database/abstract';
import { LocalItem } from '@/schema/items';
import { DateString, WeekDays } from '@/schema/util/dates';
import { useTimetableStore } from '@/store/useTimetableStore';
import { AddItem, RemoveItem, ResortItems, UpdateItem, UpdateItemSocial } from '@/utils/item';

export type TimetableHooks = {
  startDate: DateString,
  endDate: DateString,
  loading: boolean,
  items: Record<ID, LocalItem>,
  updateItem: UpdateItem,
  updateItemSocial: UpdateItemSocial,
  addItem: AddItem,
  reload: (start_date?: DateString, end_date?: DateString) => Promise<DateString[]>,
  removeItem: RemoveItem,
  resortItems: ResortItems
}

type Props = {
  children: JSX.Element;
}

/**
 * Store for all data related to timetable
 */
export const TimetableProvider = ({ children }: Props) => {
  const {
    startDate,
    endDate,
    reload,
    loading,
    items,
    updateItem,
    updateItemSocial,
    removeItem,
    addItem,
    resortItems
  } = useTimetableStore();

  const exposed: TimetableHooks = {
    startDate,
    endDate,
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

const TimetableContext = createContext<TimetableHooks>(undefined as never);

export const useTimetable = () => {
  return useContext(TimetableContext);
};
