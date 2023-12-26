import { createSlice } from "@reduxjs/toolkit";

const INITIAL_STATE = {};

export const itemsSlice = createSlice({
  name: "items",
  initialState: INITIAL_STATE,
  reducers: {
    initialiseUser: (state, action) => {
      var items = action.payload;
      items.forEach((x: any) => {
        state[x.id] = x;
      });
    },
    addItem: (state, action) => {
      var item = action.payload;
      state[item.id] = item;
    },
    updateItem: (state, action) => {
      var item = action.payload;
      state[item.id] = item;
    },
    removeItem: (state, action) => {
      var id = action.payload;
      delete state[id];
    },
    clearAllItems: (state) => {
      return {};
    },
  },
});

export const { initialiseUser, updateItem, removeItem, clearAllItems } =
  itemsSlice.actions;
