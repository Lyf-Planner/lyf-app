import { createSlice } from "@reduxjs/toolkit";

const INITIAL_STATE = {
  items: [],
  initialised: false,
};

export const itemsSlice = createSlice({
  name: "items",
  initialState: INITIAL_STATE,
  reducers: {
    initialise: (state, action) => {
      var items = action.payload;
      state.items = items;
      state.initialised = true;
    },
    addItem: (state, action) => {
      console.log("Adding item", action.payload.id);
      var item = action.payload;
      state.items.push(item);
    },
    updateItem: (state, action) => {
      var item = action.payload;
      var index = state.items.find((x) => (x.id = item.id));
      state.items[index] = item;
    },
    removeItem: (state, action) => {
      var index = state.items.find((x) => (x.id = action.payload.id));
      state.items = { ...state.items.splice(index, 1) };
    },
    cleanUpItems: (state) => {
      return { items: [], initialised: false };
    },
  },
});

export const { initialise, updateItem, addItem, removeItem, cleanUpItems } =
  itemsSlice.actions;
