import { createSlice, current } from "@reduxjs/toolkit";

const INITIAL_STATE = {};

export const userSlice = createSlice({
  name: "user",
  initialState: INITIAL_STATE,
  reducers: {
    updateUser: (state, action) => {
      return { ...action.payload };
    },
  },
});

export const { updateUser } = userSlice.actions;
