import { create } from 'zustand';

type Note = {
  id: string;
  content: string;
};

type NotesState = {
  notes: Note[];
  addNote: (note: Note) => void;
  deleteNote: (id: string) => void;
  updateNote: (updatedNote: Note) => void;
};

export const useNotesStore = create<NotesState>((set, get) => ({
  notes: [],

  addNote: (note) =>
    set((state) => ({ notes: [...state.notes, note] })),

  deleteNote: (id) =>
    set((state) => ({
      notes: state.notes.filter((note) => note.id !== id)
    })),

  updateNote: (updatedNote) => {
    const prevState = get().notes;

    set((state) => ({
      notes: state.notes.map((note) =>
        note.id === updatedNote.id ? updatedNote : note
      )
    }));

    syncUpdateNoteToApi(updatedNote).catch(() => {
      set(() => ({ notes: prevState }));
    });
  }
}));

async function syncUpdateNoteToApi(updatedNote: Note) {
  const response = await fetch(`/api/notes/${updatedNote.id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updatedNote)
  });

  if (!response.ok) {
    throw new Error('Failed to update note');
  }
}
