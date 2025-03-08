import { get, post } from '@/rest/_axios';
import { ID } from '@/schema/database/abstract';
import { Permission } from '@/schema/database/items_on_users';
import { NoteDbObject } from '@/schema/database/notes';
import { Note, NoteRelatedUser } from '@/schema/notes';
import { UserRelatedNote } from '@/schema/user';
import { SocialAction } from '@/schema/util/social';

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

export async function getNote(id: string): Promise<UserRelatedNote | undefined> {
  const endpoint = notesEndpoint(`get?id=${id}&include=users,notes,items`);

  const result = await get(endpoint);
  const note = result.data;
  if (result?.status === 200) {
    return note;
  } else {
    alert('This note is no longer available');
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

export async function moveNote(id: ID, target: ID) {
  const endpoint = notesEndpoint('move');
  const changes = {
    note_id: id,
    new_parent_id: target
  };

  const result = await post(endpoint, changes);
  if (result?.status === 200) {
    return true;
  } else {
    alert(result.data);
    return false;
  }
}

export async function sortNotes(parent_id: ID, preferences: ID[]) {
  const endpoint = notesEndpoint('sort');
  const changes = {
    parent_id,
    preferences
  };

  const result = await post(endpoint, changes);
  if (result?.status === 200) {
    return result.data;
  } else {
    alert(result.data);
  }
}

export async function updateNoteSocial(entity_id: ID, user_id: ID, action: SocialAction, permission?: Permission) {
  const endpoint = notesEndpoint('updateSocial')

  const result = await post(endpoint, {
    entity_id,
    user_id,
    action,
    permission
  });
  if (result?.status === 200) {
    return result.data as NoteRelatedUser;
  } else {
    alert(JSON.stringify(result.data));
    return false;
  }
}
