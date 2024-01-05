import { createSlice } from "@reduxjs/toolkit";

const INITIAL_STATE = {
  notes: {},
  initialised: false,
};

export const notesSlice = createSlice({
  name: "notes",
  initialState: INITIAL_STATE,
  reducers: {
    initialise: (state, action) => {
      var notess = action.payload;
      notess.forEach((x) => {
        state.notes[x.id] = x;
      });
      state.initialised = true;
    },
    addNote: (state, action) => {
      var notes = action.payload;
      state.notes[notes.id] = notes;
    },
    updateNote: (state, action) => {
      var notes = action.payload;
      state.notes[notes.id] = notes;
    },
    removeNote: (state, action) => {
      var id = action.payload;
      delete state.notes[id];
    },
    cleanUpNotes: (state) => {
      state = { notes: [], initialised: false };
    },
  },
});

export const { initialise, updateNote, removeNote, cleanUpNotes } =
  notesSlice.actions;
