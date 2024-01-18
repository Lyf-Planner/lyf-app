import { get, post } from "./axios";
import env from "../envManager";

export async function getNotes(note_ids: string[]) {
  var url = `${env.BACKEND_URL}/getNotes`;
  var body = { note_ids };

  var result = await post(url, body);
  var notes = result.data;
  if (result.status === 200) {
    return notes;
  } else {
    alert(result.text);
  }
}

export async function getNote(id: string) {
  var url = `${env.BACKEND_URL}/getNote?id=${id}`;

  var result = await get(url);
  var note = result.data;
  if (result.status === 200) {
    return note;
  } else {
    alert(result.text);
  }
}

export async function updateNote(note) {
  var url = `${env.BACKEND_URL}/updateNote`;

  var { last_updated, created, ...body } = note;
  var result = await post(url, body);
  if (result.status === 200) {
    return note;
  } else {
    alert(result.text);
  }
}

export async function createNote(note) {
  var url = `${env.BACKEND_URL}/createNote`;

  var result = await post(url, note);
  if (result.status === 200) {
    return result.data;
  } else {
    alert(result.text);
    return false;
  }
}

export async function deleteNote(id) {
  var url = `${env.BACKEND_URL}/deleteNote?note_id=${id}`;

  var result = await get(url);
  if (result.status === 200) {
    return;
  } else {
    alert(result.text);
  }
}
