import { get, post } from './axios';
import env from '../envManager';

export async function getNotes(note_ids: string[]) {
  const url = `${env.BACKEND_URL}/getNotes`;
  const body = { note_ids };

  const result = await post(url, body);
  const notes = result.data;
  if (result?.status === 200) {
    return notes;
  } else {
    alert(result.data);
  }
}

export async function getNote(id: string) {
  const url = `${env.BACKEND_URL}/getNote?id=${id}`;

  const result = await get(url);
  const note = result.data;
  if (result?.status === 200) {
    return note;
  } else {
    alert(result.data);
  }
}

export async function updateNote(note) {
  const url = `${env.BACKEND_URL}/updateNote`;

  const body = {
    id: note.id,
    title: note.title,
    content: note.content
  };
  const result = await post(url, body);
  if (result?.status === 200) {
    return note;
  } else {
    alert(result.data);
  }
}

export async function createNote(note) {
  const url = `${env.BACKEND_URL}/createNote`;

  const result = await post(url, note);
  if (result?.status === 200) {
    return result.data;
  } else {
    alert(result.data);
    return false;
  }
}

export async function deleteNote(id) {
  const url = `${env.BACKEND_URL}/deleteNote?note_id=${id}`;

  const result = await get(url);
  if (result?.status === 200) {
    return;
  } else {
    alert(result.data);
  }
}
