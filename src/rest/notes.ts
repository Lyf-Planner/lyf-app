import { get, post } from './axios';
import env from '../envManager';
import { Note } from 'schema/notes';
import { NoteDbObject } from 'schema/database/notes';
import { ID } from 'schema/database/abstract';

export async function getNote(id: string) {
  const url = `${env.BACKEND_URL}/note/get?id=${id}`;

  const result = await get(url);
  const note = result.data;
  if (result?.status === 200) {
    return note;
  } else {
    alert(result.data);
  }
}

export async function updateNote(changes: Partial<Note>) {
  const url = `${env.BACKEND_URL}/note/update`;

  const result = await post(url, changes);
  if (result?.status === 200) {
    return result.data;
  } else {
    alert(result.data);
  }
}

export async function createNote(note: NoteDbObject) {
  const url = `${env.BACKEND_URL}/note/create`;

  const result = await post(url, note);
  if (result?.status === 200) {
    return result.data;
  } else {
    alert(result.data);
    return false;
  }
}

export async function deleteNote(id: ID) {
  const url = `${env.BACKEND_URL}/note/delete?note_id=${id}`;

  const result = await get(url);
  if (result?.status === 200) {
    return;
  } else {
    alert(result.data);
  }
}
