import { createContext, useCallback, useContext, useState } from "react";
import { useAuth } from "../authorisation/AuthProvider";
import { v4 as uuid } from "uuid";
import { NoteTypes } from "../pages/notes/TypesAndHelpers";
import {
  createNote,
  deleteNote,
  getNotes,
  updateNote as updateRemoteNote,
} from "../rest/notes";
import "react-native-get-random-values";

// Assisted state management via provider
export const NotesProvider = ({ children }) => {
  const [initialised, setInitialised] = useState(false);
  const [notes, setNotes] = useState([]);
  const { user, updateUser } = useAuth();

  // We don't run this as a useEffect like in useItems
  // This is because the Notes widget is not a default and 90% of the time would be loaded unnecessarily
  const initialise = () => {
    if (!initialised) {
      getNotes(user.notes.items.map((x) => x.id)).then((results) => {
        // Sort by created
        results.sort((a, b) =>
          a.created ? a.created.localeCompare(b.created) : 1
        );

        setNotes(results);
        setInitialised(true);

        if (user.notes.items.length !== results.length) {
          console.warn("User lost some notes!");
          const relevant_ids = results.map((x) => x.id);
          var fresh_items = user.notes.items.filter((x) =>
            relevant_ids.includes(x.id)
          );

          updateUser({
            ...user,
            notes: { ...user.notes, items: fresh_items },
          });
        }
      });
    }
  };

  const updateNote = useCallback(
    (note, updateRemote = true) => {
      // Update store
      var tmp = [...notes];
      var i = tmp.findIndex((x) => x.id === note.id);
      tmp[i] = note;
      setNotes(tmp);

      if (updateRemote) updateRemoteNote(note);
    },
    [notes]
  );

  const addNote = useCallback(
    async (title: string, type: NoteTypes) => {
      var newNote = {
        id: uuid(),
        title,
        type,
        content: type === NoteTypes.Text ? "" : [],
        permitted_users: [
          {
            user_id: user.id,
            displayed_as: user.details?.name || user.id,
            permissions: "Owner",
          },
        ],
      } as any;

      // Add to store
      var tmp = [...notes];
      tmp.push(newNote);
      setNotes(tmp);

      // Add ref to user
      tmp = user;
      user.notes.items.push({ id: newNote.id });
      updateUser(user);

      // Upload in background
      createNote(newNote);
      return newNote;
    },
    [notes, user]
  );

  const removeNote = useCallback(
    (id, deleteRemote = true) => {
      // Remove from this store
      var tmp = notes.filter((x) => x.id !== id) as any;
      setNotes(tmp);

      // Remove ref from user
      tmp = user;
      tmp.notes.items = tmp.notes.items.filter((x) => x.id !== id);
      updateUser(tmp);

      if (deleteRemote) deleteNote(id);
    },
    [notes, user]
  );

  const EXPOSED = {
    initialise,
    initialised,
    notes,
    updateNote,
    addNote,
    removeNote,
  };

  return (
    <NotesContext.Provider value={EXPOSED}>{children}</NotesContext.Provider>
  );
};

const NotesContext = createContext(null);

export const useNotes = () => {
  return useContext(NotesContext);
};
