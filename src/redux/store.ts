import { configureStore } from "@reduxjs/toolkit";
import { userSlice } from "./slices/userSlice";
import { itemsSlice } from "./slices/itemsSlice";
import { notesSlice } from "./slices/notesSlice";

export const store = configureStore({
  reducer: {
    user: userSlice.reducer,
    items: itemsSlice.reducer,
    notes: notesSlice.reducer,
  },
});
