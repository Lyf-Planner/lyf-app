import { ID } from '@/schema/database/abstract';
import { ItemDbObject } from '@/schema/database/items';
import { Permission } from '@/schema/database/items_on_users';
import { NoteType } from '@/schema/database/notes';
import { UserRelatedNote } from '@/schema/user';
import { SocialAction } from '@/schema/util/social';

export type UpdateNote = (note: UserRelatedNote, changes: Partial<UserRelatedNote>, updateRemote?: boolean) => void;
export type UpdateNoteItem = (item: ItemDbObject, changes: Partial<ItemDbObject>, remove?: boolean) => Promise<void>;
export type UpdateNoteSocial = (
  note: UserRelatedNote,
  user_id: string,
  action: SocialAction,
  permission: Permission
) => Promise<void>;

export type AddNote = (title: string, type: NoteType) => Promise<ID>;
export type RemoveNote = (id: string, deleteRemote?: boolean) => Promise<void>;
