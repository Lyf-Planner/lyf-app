import { createSlice } from "@reduxjs/toolkit";

const INITIAL_STATE = {
  userNotes: {},
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
    },
    addNote: (state, action) => {
      var notes = action.payload;
      state.userNotes[notes.id] = notes;
    },
    updateNote: (state, action) => {
      var notes = action.payload;
      state.userNotes[notes.id] = notes;
    },
    removeNote: (state, action) => {
      var id = action.payload;
      delete state.userNotes[id];
    },
    clearAllNotes: (state) => {
      state = { userNotes: {} };
    },
  },
});

export const { initialiseUser, updateNote, removeNote, clearAllNotes } =
  notesSlice.actions;
