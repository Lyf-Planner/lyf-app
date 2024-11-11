import { createContext, useContext } from 'react';

import 'react-native-get-random-values';

import { ID } from '@/schema/database/abstract';
import { NoteType } from '@/schema/database/notes';
import { UserRelatedNote } from '@/schema/user';
import { useNotesStore } from '@/store/useNotesStore';
import { UpdateNoteItem } from '@/utils/note';

export type NoteHooks = {
  loading: boolean,
  reload: () => void,
  notes: Record<ID, UserRelatedNote>,
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
  const { loading, reload, notes, handleNoteItemUpdate, loadNote, updateNote, addNote, removeNote } = useNotesStore();

  const exposed: NoteHooks = {
    loading,
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

const NotesContext = createContext<NoteHooks>(undefined as never);

export const useNotes = () => {
  return useContext(NotesContext);
};
