import { createSlice } from "@reduxjs/toolkit";

const INITIAL_STATE = {
  userItems: {},
  last_change: new Date(),
};

export const itemsSlice = createSlice({
  name: "items",
  initialState: INITIAL_STATE,
  reducers: {
    initialiseUser: (state, action) => {
      var items = action.payload;
      items.forEach((x: any) => {
        state.userItems[x.id] = x;
      });
      state.last_change = new Date();
    },
    addItem: (state, action) => {
      var item = action.payload;
      state.userItems[item.id] = item;
      state.last_change = new Date();
    },
    updateItem: (state, action) => {
      var item = action.payload;
      state.userItems[item.id] = item;
      state.last_change = new Date();
    },
    removeItem: (state, action) => {
      var id = action.payload;
      delete state.userItems[id];
      state.last_change = new Date();
    },
    clearAllItems: (state) => {
      state.userItems = {};
      state.last_change = new Date();
    },
  },
});

export const { initialiseUser, updateItem, removeItem, clearAllItems } =
  itemsSlice.actions;
