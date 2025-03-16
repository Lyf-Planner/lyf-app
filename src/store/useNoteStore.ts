import { v4 as uuid } from 'uuid';
import { create } from 'zustand';

import 'react-native-get-random-values';

import { AuthState, useAuthStore } from './useAuthStore';

import {
  createNote,
  deleteNote,
  getNote,
  moveNote,
  myNotes,
  sortNotes,
  updateNote as updateRemoteNote,
  updateNoteSocial as updateRemoteNoteSocial
} from '@/rest/notes';
import { ID } from '@/schema/database/abstract';
import { ItemDbObject } from '@/schema/database/items';
import { Permission } from '@/schema/database/items_on_users';
import { NoteType } from '@/schema/database/notes';
import { UserRelatedNote } from '@/schema/user';
import { SocialAction } from '@/schema/util/social';
import { AddNote, RemoveNote, SortNotes, UpdateNote, UpdateNoteItem, UpdateNoteSocial } from '@/utils/note';

export type NotesState = {
  loading: boolean,
  moving: string | null;
  movingFrom: string | null;
  notes: Record<ID, UserRelatedNote>,
  rootNotes: ID[],
  sorting: boolean;

  reload: () => Promise<void>,
  loadNote: (id: ID) => Promise<void>,

  addNote: AddNote,
  handleNoteItemUpdate: UpdateNoteItem,
  moveNote: (id: ID, target: ID) => Promise<void>,
  removeNote: RemoveNote,
  setMoving: (id: ID | null, from: ID | null) => void,
  setSorting: (sorting: boolean) => void,
  sortNotes: SortNotes,
  updateNote: UpdateNote,
  updateNoteSocial: UpdateNoteSocial,
}

export const useNoteStore = create<NotesState>((set, get) => ({
  loading: true,
  moving: null,
  movingFrom: null,
  notes: {},
  rootNotes: [],
  sorting: false,

  reload: async () => {
    const { notes } = get();

    set({ loading: true });
    const cloudNotes = await myNotes() as UserRelatedNote[];
    const newRootNotes: Record<ID, UserRelatedNote> = {};

    cloudNotes.forEach((note) => {
      newRootNotes[note.id] = note;
    })

    set({
      notes: { ...notes, ...newRootNotes },
      rootNotes: Object.keys(newRootNotes),
      loading: false
    });
  },

  loadNote: async (id: ID) => {
    const { notes } = get();
    set({ loading: true });

    const loadedNote = await getNote(id);
    if (!loadedNote) {
      set({ loading: false });
      return;
    }

    // also load in this notes children, for a slightly better cache - only if they're not in store already
    const loadedNoteChildren = loadedNote?.relations.notes ?? [];
    const noteChildrenObject: Record<ID, UserRelatedNote> = {};
    loadedNoteChildren.forEach((note) => {
      if (!notes[note.id]) {
        noteChildrenObject[note.id] = {
          ...note,
          // take the relation from the parent, it will get updated to something more correct when we navigate to it
          relations: {},
          invite_pending: loadedNote.invite_pending,
          permission: loadedNote.permission,
          sorting_rank_preference: loadedNote.sorting_rank_preference
        }
      }
    });

    // add the loaded note, and also all it's children for a smarter cache
    set({ notes: { ...notes, [id]: loadedNote, ...noteChildrenObject }, loading: false });
  },

  addNote: async (title: string, type: NoteType, rank: number, parent_id?: ID) => {
    const { notes, rootNotes } = get();
    const newNote: UserRelatedNote & { parent_id?: ID } = {
      id: uuid(),
      parent_id,
      created: new Date(),
      last_updated: new Date(),
      title,
      type,
      content: type !== NoteType.ListOnly ? '' : undefined,
      collaborative: false,
      invite_pending: false,
      permission: Permission.Owner,
      relations: {},
      sorting_rank_preference: rank
    };

    set({ notes: { ...notes, [newNote.id]: newNote } });
    if (!parent_id) {
      set({ rootNotes: rootNotes.concat([newNote.id]) })
    }

    // Upload in background, remove from store on failure
    try {
      await createNote(newNote);
    } catch (err) {
      console.error('Error creating note, rolling back store', { err });
      get().removeNote(newNote.id, false);
    }

    return newNote.id;
  },

  moveNote: async (id: ID, target: ID) => {
    const { movingFrom, notes, rootNotes, loadNote } = get();
    set({ loading: true });

    const success = await moveNote(id, target);

    if (success) {
      // reload source
      if (movingFrom && movingFrom !== 'root' && notes[movingFrom]) {
        await loadNote(movingFrom);
      }

      // reload target
      if (target !== 'root') {
        await loadNote(target);
      }

      // handle any root changes
      const isAddingToRoot = !rootNotes.includes(id) && movingFrom !== 'root' && target === 'root';
      const isLeavingRoot = rootNotes.includes(id) && movingFrom === 'root' && target !== 'root';

      if (isAddingToRoot) {
        const newRootNotes = [...rootNotes];
        newRootNotes.push(id);
        set({ rootNotes: newRootNotes });
      } else if (isLeavingRoot) {
        const newRootNotes = [...rootNotes];
        const rootIndex = rootNotes.indexOf(id);
        if (rootIndex !== -1) {
          newRootNotes.splice(rootIndex, 1)
        }
        set({ rootNotes: newRootNotes });
      }
    }

    set({ loading: false, moving: null, movingFrom: null });
  },

  removeNote: async (id: ID, deleteRemote = true) => {
    // Remove from this store
    const { notes, rootNotes } = get();
    const newNotes = { ...notes };
    delete newNotes[id];

    // Remove the note from it's parent
    Object.values(newNotes).forEach((note) => {
      if (note.relations?.notes) {
        const newChildNotes = [...note.relations.notes];
        const index = note.relations.notes.findIndex((childNote) => childNote.id === id)

        if (index !== -1) {
          newChildNotes.splice(index, 1);
          note.relations.notes = newChildNotes;
        }
      }
    })

    // Remove from root layer
    const newRootNotes = [...rootNotes];
    const rootIndex = rootNotes.indexOf(id);
    if (rootIndex !== -1) {
      newRootNotes.splice(rootIndex, 1)
    }

    set({ notes: newNotes, rootNotes: newRootNotes });

    if (deleteRemote) {
      await deleteNote(id);
    }
  },

  setMoving: (moving: ID | null, from: ID | null) => {
    set({ moving, movingFrom: from })
  },

  setSorting: (sorting: boolean) => {
    set({ sorting })
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
    targetUser: ID,
    action: SocialAction,
    permission: Permission
  ) => {
    const { user } = useAuthStore.getState();
    const { notes, removeNote, updateNote } = get();

    const result = await updateRemoteNoteSocial(note.id, targetUser, action, permission);
    if (result === false) {
      return;
    }

    const leavingItem = targetUser === user?.id && action === SocialAction.Remove;
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
    const j = noteUsers.findIndex((x) => x.id === targetUser);

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
      collaborative: noteUsers.length > 1,
      invite_pending: false // if i'm updating a note's social, i either have access or am accepting access, or it's already gone
    }

    updateNote(note, noteChanges, false)
  },

  handleNoteItemUpdate: async (item: ItemDbObject, changes: Partial<ItemDbObject>, remove = false) => {
    // This function is merely a store update, the remote item gets updated before being passed here by the item store.
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
  },

  sortNotes: async (parent_id: ID, priorities: ID[]) => {
    if (priorities.length === 0) {
      return;
    }

    const { notes, updateNote } = get();

    // for root we can't sort via the relation on the children
    // instead we update each notes default_sorting_rank
    if (parent_id === 'root') {
      for (const i in priorities) {
        const id = priorities[i];
        if (!notes[id]) {
          console.error('note', id, 'should have been loaded before sorting, as a root note');
          return;
        }

        updateNote(notes[id], { sorting_rank_preference: parseInt(i, 10) });
      }
      return;
    }

    if (!notes[parent_id].relations.notes) {
      console.error('parent note or parent note children could not be found');
      return;
    }

    const newNoteChildren = [];
    for (const childNote of notes[parent_id].relations.notes) {
      newNoteChildren.push({
        ...childNote,
        sorting_rank: priorities.indexOf(childNote.id)
      })
    }

    const newParentNote = {
      ...notes[parent_id],
      relations: {
        ...notes[parent_id].relations,
        notes: newNoteChildren
      }
    }

    updateNote(notes[parent_id], newParentNote, false);
    sortNotes(parent_id, priorities); // tell the backend
  }
}));

// listeners
useAuthStore.subscribe((state: AuthState, prevState: AuthState) => {
  // initialise notes store in response to authorisation
  if (state.user && !prevState.user) {
    useNoteStore.getState().reload();
  }
});
