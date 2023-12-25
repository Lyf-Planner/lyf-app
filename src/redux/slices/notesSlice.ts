import { createSlice } from "@reduxjs/toolkit";

const INITIAL_STATE = {
  userNotes: {},
  last_change: new Date(),
};

export const notesSlice = createSlice({
  name: "notes",
  initialState: INITIAL_STATE,
  reducers: {
    initialiseUser: (state, action) => {
      var notess = action.payload;
      notess.forEach((x: any) => {
        state.userNotes[x.id] = x;
      });
      state.last_change = new Date();
    },
    addNote: (state, action) => {
      var notes = action.payload;
      state.userNotes[notes.id] = notes;
      state.last_change = new Date();
    },
    updateNote: (state, action) => {
      var notes = action.payload;
      state.userNotes[notes.id] = notes;
      state.last_change = new Date();
    },
    removeNote: (state, action) => {
      var id = action.payload;
      delete state.userNotes[id];
      state.last_change = new Date();
    },
    clearAllNotes: (state) => {
      state = { userNotes: {}, last_change: new Date() };
    },
  },
});

export const { initialiseUser, updateNote, removeNote, clearAllNotes } =
  notesSlice.actions;
