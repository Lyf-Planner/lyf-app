import { View } from "react-native";
import { Dropdown } from "../../components/Dropdown";

export const Notes = ({ notes, updateNotes }: any) => {
  const updateNote = (title: any, content: any) => {
    var i = notes.items.findIndex((x: any) => x.title === title);
    var newNotes = notes.items;
    newNotes[i].content = content;
    updateNotes({ items: newNotes });
  };
  const addNote = (newNoteTitle: any) => {
    var newNotes = notes.items;
    newNotes.push({ title: newNoteTitle, content: "" });
    updateNotes({ items: newNotes });
  };
  const removeNote = (title: any) => {
    var i = notes.items.findIndex((x: any) => x.title === title);
    var newNotes = notes.items;
    newNotes.splice(i, 1);
    updateNotes({ items: newNotes });
  };

  return <View></View>;
};

export const Note = ({ note }) => {
  return (
    <Dropdown>
      <View></View>
    </Dropdown>
  );
};
