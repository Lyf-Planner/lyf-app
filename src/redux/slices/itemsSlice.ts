import { createSlice } from "@reduxjs/toolkit";

const INITIAL_STATE = {
  userItems: {},
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
    },
    addItem: (state, action) => {
      var item = action.payload;
      state.userItems[item.id] = item;
    },
    updateItem: (state, action) => {
      var item = action.payload;
      state.userItems[item.id] = item;
    },
    removeItem: (state, action) => {
      var id = action.payload;
      delete state.userItems[id];
    },
    clearAllItems: (state) => {
      state.userItems = {};
    },
  },
});

export const { initialiseUser, updateItem, removeItem, clearAllItems } =
  itemsSlice.actions;
