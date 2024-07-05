import { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { useAuth } from 'providers/cloud/useAuth';
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

export type NoteHooks = {
  loading: boolean,
  reload: () => void,
  notes: UserRelatedNote[],
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
  const [loading, setLoading] = useState(true);
  const [notes, setNotes] = useState<UserRelatedNote[]>([]);

  const reload = useCallback(async () => {
    if (!initialised) {
      setLoading(true);
    } else {
      setSyncing(true);
    }
   
    const notes = await myNotes();
    setNotes(notes);

    if (!initialised) {
      setLoading(false);
      setInitialised(true);
    } else {
      setSyncing(false);
    }
    setLoading(false);
  }, [])

  const updateNote = useCallback(
    async (note: UserRelatedNote, changes: Partial<UserRelatedNote>, updateRemote = true) => {
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
    },
    [notes]
  );

  const addNote = useCallback(
    async (title: string, type: NoteType) => {
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
    },
    [notes]
  );

  const removeNote = useCallback(
    async (id, deleteRemote = true) => {
      // Remove from this store
      setNotes(notes.filter((note) => note.id !== id));

      if (deleteRemote) {
        setSyncing(true)
        await deleteNote(id);
        setSyncing(false);
      }
    },
    [notes]
  );

  const exposed: NoteHooks = {
    loading,
    reload,
    notes,
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
