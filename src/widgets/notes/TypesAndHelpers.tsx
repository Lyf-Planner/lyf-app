import "react-native-get-random-values";
import { v4 as uuid } from "uuid";

export enum NoteTypes {
  List = "List",
  Text = "Text",
}

export const NoteTypeInitialiser = {
  List: [],
  Text: "",
};

export const TypeToDisplayName = {
  List: "List",
  Text: "Note",
};

export const updateNote = (notes, updateNotes, id, updatedNote) => {
  var i = notes.items.findIndex((x: any) => x.id === id);
  var newNotes = notes.items;
  newNotes[i] = updatedNote;
  updateNotes({ items: newNotes });
};

export const addNote = (
  notes,
  updateNotes,
  noteType: NoteTypes,
  newNoteName?: string
) => {
  const id = uuid();
  var newNotes = notes.items;
  const newNote = {
    id,
    title: newNoteName || `New ${TypeToDisplayName[noteType]}`,
    content: NoteTypeInitialiser[noteType],
    type: noteType,
  };
  newNotes.unshift(newNote);

  updateNotes({ items: newNotes });

  return newNote;
};

export const removeNote = (notes, updateNotes, id: any) => {
  var i = notes.items.findIndex((x: any) => x.id === id);
  var newNotes = notes.items;
  newNotes.splice(i, 1);
  updateNotes({ items: newNotes });
};
