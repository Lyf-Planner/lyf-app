import { v4 as uuid } from 'uuid';
import { create } from 'zustand';

import 'react-native-get-random-values';

import { AuthState, useAuthStore } from './useAuthStore';

import {
  createNote,
  deleteNote,
  getNote,
  myNotes,
  updateNote as updateRemoteNote,
  updateNoteSocial as updateRemoteNoteSocial
} from '@/rest/notes';
import { ID } from '@/schema/database/abstract';
import { ItemDbObject } from '@/schema/database/items';
import { Permission } from '@/schema/database/items_on_users';
import { NoteType } from '@/schema/database/notes';
import { UserRelatedNote } from '@/schema/user';
import { SocialAction } from '@/schema/util/social';
import { AddNote, RemoveNote, UpdateNote, UpdateNoteItem, UpdateNoteSocial } from '@/utils/note';

export type NotesState = {
  loading: boolean,
  notes: Record<ID, UserRelatedNote>,

  reload: () => Promise<void>,
  loadNote: (id: ID) => Promise<void>,

  updateNote: UpdateNote,
  handleNoteItemUpdate: UpdateNoteItem,
  updateNoteSocial: UpdateNoteSocial,
  addNote: AddNote,
  removeNote: RemoveNote
}

export const useNoteStore = create<NotesState>((set, get) => ({
  loading: true,
  notes: {},

  reload: async () => {
    set({ loading: true });
    const cloudNotes = await myNotes() as UserRelatedNote[];
    const notes: Record<ID, UserRelatedNote> = {};

    cloudNotes.forEach((note) => {
      notes[note.id] = note;
    })

    set({ notes, loading: false });
  },

  loadNote: async (id: ID) => {
    const { notes } = get();
    const note = await getNote(id);
    set({ notes: { ...notes, [id]: note } });
  },

  addNote: async (title: string, type: NoteType) => {
    const { notes } = get();
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

    set({ notes: { ...notes, [newNote.id]: newNote } });

    // Upload in background, remove from store on failure
    try {
      await createNote(newNote);
    } catch (err) {
      console.error('Error creating note, rolling back store', { err });
      get().removeNote(newNote.id, false);
    }

    return newNote.id;
  },

  removeNote: async (id: ID, deleteRemote = true) => {
    // Remove from this store
    const { notes } = get();
    delete notes[id];
    set({ notes });

    if (deleteRemote) {
      await deleteNote(id);
    }
  },

  updateNote: async (note: UserRelatedNote, changes: Partial<UserRelatedNote>, updateRemote = true) => {
    // Update store
    const { notes } = get()
    set({ notes: {
      ...notes,
      [note.id]: {
        ...note,
        ...changes
      }
    } });

    // Update cloud, revert store on error
    if (updateRemote) {
      try {
        await updateRemoteNote({
          id: note.id,
          ...changes
        });
      } catch (err) {
        console.error('Error updating note, rolling back store', { err });
        set({ notes: {
          ...notes,
          [note.id]: note
        } });
      }
    }
  },

  updateNoteSocial: async (
    note: UserRelatedNote,
    user_id: string,
    action: SocialAction,
    permission: Permission
  ) => {
    const { user } = useAuthStore.getState();
    const { notes, removeNote, updateNote } = get();

    const result = await updateRemoteNoteSocial(note.id, user_id, action, permission);
    if (result === false) {
      return;
    }

    const leavingItem = user_id === user?.id && action === SocialAction.Remove;
    if (leavingItem) {
      await removeNote(note.id, false);
      return;
    }

    const destructiveAction =
      action === SocialAction.Remove ||
      action === SocialAction.Decline ||
      action === SocialAction.Cancel;

    const storeItem = notes[note.id];
    const noteUsers = storeItem.relations.users || [];
    const j = noteUsers.findIndex((x) => x.id === user_id);

    if (j === -1 && !destructiveAction) {
      // Create
      noteUsers.push(result);
    } else if (destructiveAction) {
      // Delete
      noteUsers.splice(j, 1);
    } else {
      // Update
      noteUsers[j] = { ...noteUsers[j], ...result };
    }

    const noteChanges: Partial<UserRelatedNote> = {
      relations: { ...note.relations, users: noteUsers },
      // Some manual sneakys for local state
      collaborative: noteUsers.length > 1,
      invite_pending: false
    }

    updateNote(note, noteChanges, false)
  },

  handleNoteItemUpdate: async (item: ItemDbObject, changes: Partial<ItemDbObject>, remove = false) => {
    // This function is merely a store update, the item itself gets updated when passed here by the item store.
    if (!item.note_id) {
      console.warn('Escaping note item update - item has no note_id');
      return;
    }

    const { notes } = get();
    const note = notes[item.note_id];

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
    get().updateNote(note, noteChanges, false);
  }
}));

// listeners
useAuthStore.subscribe((state: AuthState, prevState: AuthState) => {
  // initialise notes store in response to authorisation
  if (state.user && !prevState.user) {
    useNoteStore.getState().reload();
  }
});
