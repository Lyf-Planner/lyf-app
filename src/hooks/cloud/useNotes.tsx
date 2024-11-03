import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

import { v4 as uuid } from 'uuid';
import {
  createNote,
  deleteNote,
  getNote,
  myNotes,
  updateNote as updateRemoteNote
} from 'rest/notes';

import 'react-native-get-random-values';
import { ID } from 'schema/database/abstract';
import { ItemDbObject } from 'schema/database/items';
import { Permission } from 'schema/database/items_on_users';
import { NoteType } from 'schema/database/notes';
import { LocalItem } from 'schema/items';
import { UserRelatedNote } from 'schema/user';

import { useCloud } from './cloudProvider';

export type UpdateNoteItem = (item: ItemDbObject, changes: Partial<ItemDbObject>, remove?: boolean) => Promise<void>

export type NoteHooks = {
  loading: boolean,
  reload: () => void,
  notes: UserRelatedNote[],
  handleNoteItemUpdate: UpdateNoteItem,
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
  }, []);

  useEffect(() => {
    reload()
  }, []);

  const loadNote = async (id: ID) => {
    setSyncing(true)
    const note = await getNote(id);
    setSyncing(false);
    updateNote(note, {}, false)
  }

  const handleNoteItemUpdate = async (item: ItemDbObject, changes: Partial<ItemDbObject>, remove = false) => {
    const i = notes.findIndex((note) => note.id === item.note_id);

    const note = notes[i];
    const noteItems = note.relations?.items ? [...note.relations.items] : [];
    const j = noteItems.findIndex((x) => x.id === item.id);

    if (j === -1 && !remove) {
      // Create
      noteItems.push(item);
    } else if (remove) {
      // Delete
      noteItems.splice(j, 1);
    } else {
      // Update
      const newNoteItem = { ...item, ...changes }
      noteItems[j] = newNoteItem;
    }

    const noteChanges = { relations: { ...note.relations, items: noteItems } }
    updateNote(note, noteChanges, false);
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
