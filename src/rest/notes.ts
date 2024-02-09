import { get, post } from "./axios";
import env from "../envManager";

export async function getNotes(note_ids: string[]) {
  var url = `${env.BACKEND_URL}/getNotes`;
  var body = { note_ids };

  var result = await post(url, body);
  var notes = result.data;
  if (result?.status === 200) {
    return notes;
  } else {
    alert(result.data);
  }
}

export async function getNote(id: string) {
  var url = `${env.BACKEND_URL}/getNote?id=${id}`;

  var result = await get(url);
  var note = result.data;
  if (result?.status === 200) {
    return note;
  } else {
    alert(result.data);
  }
}

export async function updateNote(note) {
  var url = `${env.BACKEND_URL}/updateNote`;

  var body = {
    id: note.id,
    title: note.title,
    content: note.content,
  };
  var result = await post(url, body);
  if (result?.status === 200) {
    return note;
  } else {
    alert(result.data);
  }
}

export async function createNote(note) {
  var url = `${env.BACKEND_URL}/createNote`;

  var result = await post(url, note);
  if (result?.status === 200) {
    return result.data;
  } else {
    alert(result.data);
    return false;
  }
}

export async function deleteNote(id) {
  var url = `${env.BACKEND_URL}/deleteNote?note_id=${id}`;

  var result = await get(url);
  if (result?.status === 200) {
    return;
  } else {
    alert(result.data);
  }
}
