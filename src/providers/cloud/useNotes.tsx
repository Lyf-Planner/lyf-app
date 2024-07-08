import { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { v4 as uuid } from 'uuid';
import {
  createNote,
  deleteNote,
  getNote,
  myNotes,
  updateNote as updateRemoteNote
} from 'rest/notes';
import 'react-native-get-random-values';
import { UserRelatedNote } from 'schema/user';
import { NoteType } from 'schema/database/notes';
import { Permission } from 'schema/database/items_on_users';
import { useCloud } from './cloudProvider';
import { ID } from 'schema/database/abstract';
import { LocalItem } from 'schema/items';

export type NoteHooks = {
  loading: boolean,
  reload: () => void,
  notes: UserRelatedNote[],
  handleNoteItemUpdate: (item: LocalItem, changes: Partial<LocalItem>, remove?: boolean) => void,
  loadNote: (id: ID) => Promise<void>,
  updateNote: (note: UserRelatedNote, changes: Partial<UserRelatedNote>, updateRemote?: boolean) => void,
  addNote: (title: string, type: NoteType) => Promise<ID>,
  removeNote: (id: string, deleteRemote?: boolean) => void
}

type Props = {
  children: JSX.Element;
}

// Assisted state management via provider
export const NotesProvider = ({ children }: Props) => {
  const { setSyncing } = useCloud();

  const [initialised, setInitialised] = useState(false);
  const [notes, setNotes] = useState<UserRelatedNote[]>([]);

  const reload = useCallback(async () => {
    if (initialised) {
      setSyncing(true);
    }
   
    const notes = await myNotes();
    setNotes(notes);

    if (!initialised) {
      setInitialised(true);
    } else {
      setSyncing(false);
    }
  }, [])

  const loadNote = async (id: ID) => {
    setSyncing(true)
    const note = await getNote(id);
    setSyncing(false);
    updateNote(note, {}, false)
  }

  const handleNoteItemUpdate = (item: LocalItem, changes: Partial<LocalItem>, remove = false) => {
    const i = notes.findIndex((note) => note.id === item.note_id);
    if (i === -1) {
      console.warn('Item update passed without known note id, nothing to handle');
      return
    }

    const note = notes[i];
    const noteItems = note.relations.items || [];
    const j = noteItems.findIndex((x) => x.id === item.id);

    if (j === -1 && !remove) {
      // Create
      noteItems.push(item);
    } else if (remove) {
      // Delete
      noteItems.splice(j, 1);
    } else {
      // Update
      const newNote = { ...item, ...changes }
      noteItems[j] = { ...item, ...changes };
    }

    const noteChanges = { relations: { ...note.relations, items: noteItems }}
    updateNote(note, noteChanges, false)
  }

  const updateNote = async (note: UserRelatedNote, changes: Partial<UserRelatedNote>, updateRemote = true) => {
    // Update store
    const tmp = [...notes];
    const i = tmp.findIndex((x) => x.id === note.id);
    tmp[i] = {
      ...note,
      ...changes
    };
    setNotes(tmp);

    if (updateRemote) {
      setSyncing(true);
      await updateRemoteNote({
        id: note.id,
        ...changes
      });
      setSyncing(false);
    }
  }

  const addNote = async (title: string, type: NoteType) => {
    const newNote: UserRelatedNote = {
      id: uuid(),
      created: new Date(),
      last_updated: new Date(),
      title,
      type,
      content: type !== NoteType.ListOnly ? '' : undefined,
      collaborative: false,
      invite_pending: false,
      permission: Permission.Owner,
      relations: {}
    };

    // Add to store
    setNotes([...notes, newNote]);

    // Upload in background
    setSyncing(true);
    await createNote(newNote);
    setSyncing(false);
    
    return newNote.id;
  }

  const removeNote = async (id: ID, deleteRemote = true) => {
    // Remove from this store
    setNotes(notes.filter((note) => note.id !== id));

    if (deleteRemote) {
      setSyncing(true)
      await deleteNote(id);
      setSyncing(false);
    }
  }

  const exposed: NoteHooks = {
    loading: !initialised,
    reload,
    notes,
    handleNoteItemUpdate,
    loadNote,
    updateNote,
    addNote,
    removeNote
  };

  return (
    <NotesContext.Provider value={exposed}>{children}</NotesContext.Provider>
  );
};

const NotesContext = createContext<NoteHooks>(undefined as any);

export const useNotes = () => {
  return useContext(NotesContext);
};
