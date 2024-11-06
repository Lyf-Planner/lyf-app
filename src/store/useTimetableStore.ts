import { create } from 'zustand';

type TimetableEntry = {
  id: string;
  subject: string;
  time: string;
};

type TimetableState = {
  timetable: TimetableEntry[];
  addEntry: (entry: TimetableEntry) => void;
  removeEntry: (id: string) => void;
};

export const useTimetableStore = create<TimetableState>((set) => ({
  timetable: [],
  addEntry: (entry) =>
    set((state) => ({ timetable: [...state.timetable, entry] })),
  removeEntry: (id) =>
    set((state) => ({
      timetable: state.timetable.filter((entry) => entry.id !== id)
    }))
}));
