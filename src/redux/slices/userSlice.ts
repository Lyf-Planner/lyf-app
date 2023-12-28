import { createSlice, current } from "@reduxjs/toolkit";

const INITIAL_STATE = {};

export const userSlice = createSlice({
  name: "user",
  initialState: INITIAL_STATE,
  reducers: {
    updateUser: (state, action) => {
      return { ...action.payload };
    },
    savedUser: (state: any, action) => {
      return { ...state, save: new Date().getTime() };
    },
    addTimetableItem: (state: any, action) => {
      console.log("Adding item to timetable:", action.payload);
      return {
        ...state,
        timetable: {
          ...state.timetable,
          items: [...state.timetable.items, action.payload],
        },
        last_updated: new Date().toUTCString(),
      };
    },
    removeTimetableItem: (state: any, action) => {
      var i = state.timetable.items.find((x) => x.id === action.payload);
      state.timetable.items.splice(i, 1);
      state.last_updated = new Date().toUTCString();
    },
    updateTimetableItem: (state: any, action) => {
      var i = state.timetable.items.find((x) => x.id === action.payload.id);
      state.timetable.items[i] = {
        id: action.payload.id,
        notification: action.payload.notification,
      };
      state.last_updated = new Date().toUTCString();
    },
    updateTimetableStart: (state: any, action) => {
      state.timetable.first_day = action.payload;
      state.last_updated = new Date().toUTCString();
    },
  },
});

export const {
  updateUser,
  savedUser,
  addTimetableItem,
  removeTimetableItem,
  updateTimetableItem,
  updateTimetableStart,
} = userSlice.actions;
