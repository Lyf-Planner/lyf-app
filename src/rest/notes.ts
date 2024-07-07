import { get, post } from './axios';
import env from '../envManager';
import { Note } from 'schema/notes';
import { NoteDbObject } from 'schema/database/notes';
import { ID } from 'schema/database/abstract';

const notesEndpoint = (req: string) => `/notes/${req}`;

export async function myNotes() {
  const endpoint = notesEndpoint('myNotes');

  const result = await get(endpoint);
  const notes = result.data;
  if (result?.status === 200) {
    return notes;
  } else {
    alert(result.data);
  }
}

export async function getNote(id: string) {
  const endpoint = notesEndpoint(`get?id=${id}`)

  const result = await get(endpoint);
  const note = result.data;
  if (result?.status === 200) {
    return note;
  } else {
    alert(result.data);
  }
}

export async function updateNote(changes: Partial<Note>) {
  const endpoint = notesEndpoint('update');

  const result = await post(endpoint, changes);
  if (result?.status === 200) {
    return result.data;
  } else {
    alert(result.data);
  }
}

export async function createNote(note: NoteDbObject) {
  const endpoint = notesEndpoint('create');

  const result = await post(endpoint, note);
  if (result?.status === 201) {
    return result.data;
  } else {
    alert(result.data);
    return false;
  }
}

export async function deleteNote(id: ID) {
  const endpoint = notesEndpoint(`delete?note_id=${id}`)

  const result = await get(endpoint);
  if (result?.status === 204) {
    return;
  } else {
    alert(result.data);
  }
}
