import { createSlice } from "@reduxjs/toolkit";

const INITIAL_STATE = {
  last_updated: new Date(),
};

export const userSlice = createSlice({
  name: "user",
  initialState: INITIAL_STATE,
  reducers: {
    updateUser: (state, action) => {
      // Redux Toolkit allows us to write "mutating" logic in reducers. It
      // doesn't actually mutate the state because it uses the Immer library,
      // which detects changes to a "draft state" and produces a brand new
      // immutable state based off those changes
      state = action.payload;
      state.last_updated = new Date();
    },
  },
});

export const { updateUser } = userSlice.actions;
