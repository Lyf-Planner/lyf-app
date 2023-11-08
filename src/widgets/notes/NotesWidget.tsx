import { View, Text, StyleSheet } from "react-native";
import { TouchableHighlight } from "react-native-gesture-handler";
import { Horizontal } from "../../components/MiscComponents";
import { useState } from "react";

import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

export const Notes = ({ notes, updateNotes }: any) => {
  const [focussedNote, setFocussedNote] = useState(null);

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

  return (
    <View style={{}}>
      <View style={styles.myNotesHeader}>
        <Text style={styles.myNotesTitle}>My Notes</Text>
        <View style={{ marginLeft: "auto", marginRight: 5 }}>
          <NewNoteButton addNote={() => {}} />
        </View>
      </View>
      <View></View>
      <Horizontal style={{ marginBottom: 2, borderWidth: 2, opacity: 0.6 }} />
    </View>
  );
};

export const NoteAccessPoint = ({ note }) => {
  return <View></View>;
};

export const NewNoteButton = ({ addNote }) => {
  return (
    <TouchableHighlight
      style={{ padding: 4, borderRadius: 5 }}
      underlayColor="rgba(0,0,0,0.2)"
      onPress={() => console.log("")}
    >
      <MaterialCommunityIcons name="note-plus-outline" size={30} />
    </TouchableHighlight>
  );
};

const styles = StyleSheet.create({
  myNotesHeader: {
    flexDirection: "row",
    height: 40,
    alignItems: "center",
    paddingHorizontal: 4,
    marginTop: 8,
    marginBottom: 8,
  },
  myNotesTitle: { fontSize: 22, fontWeight: "700" },
});
