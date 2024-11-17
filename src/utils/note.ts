import { ID } from '@/schema/database/abstract';
import { ItemDbObject } from '@/schema/database/items';
import { NoteType } from '@/schema/database/notes';
import { UserRelatedNote } from '@/schema/user';

export type UpdateNoteItem = (item: ItemDbObject, changes: Partial<ItemDbObject>, remove?: boolean) => Promise<void>;
export type UpdateNote = (note: UserRelatedNote, changes: Partial<UserRelatedNote>, updateRemote?: boolean) => void;
export type AddNote = (title: string, type: NoteType) => Promise<ID>;
export type RemoveNote = (id: string, deleteRemote?: boolean) => Promise<void>;
