import { View, Text, StyleSheet } from "react-native";
import { TouchableHighlight } from "react-native-gesture-handler";
import { Horizontal } from "../../components/MiscComponents";
import { useState } from "react";
import { NewNoteMenu, NoteTypeInitialiser, NoteTypes } from "./NewNoteAdd";
import { NoteView } from "./NoteView";
import { NoteBanner } from "./NoteBanner";

export const Notes = ({ notes, updateNotes }: any) => {
  const [focussedNote, setFocussedNote] = useState(null);
  const [newNote, setNewNote] = useState(false);

  const updateNote = (title: any, content: any) => {
    var i = notes.items.findIndex((x: any) => x.title === title);
    var newNotes = notes.items;
    newNotes[i].content = content;
    updateNotes({ items: newNotes });
  };
  const addNote = (noteType: NoteTypes) => {
    console.log("adding note", noteType);
    var newNotes = notes.items;
    newNotes.unshift({
      title: `New ${noteType}`,
      content: NoteTypeInitialiser[noteType],
      type: noteType,
    });
    console.log("new notes are", newNotes);
    updateNotes({ items: newNotes });
    setNewNote(true);
    setFocussedNote(notes[0]);
  };
  const removeNote = (title: any) => {
    console.log("removing note", title);
    var i = notes.items.findIndex((x: any) => x.title === title);
    var newNotes = notes.items;
    newNotes.splice(i, 1);
    updateNotes({ items: newNotes });
  };

  if (focussedNote)
    return (
      <NoteView
        note={focussedNote}
        onBack={() => {
          setFocussedNote(null);
          setNewNote(false);
        }}
        initialising={newNote}
        updateNote={updateNote}
      />
    );
  else
    return (
      <View style={{}}>
        <View style={styles.myNotesHeader}>
          <Text style={styles.myNotesTitle}>My Notes</Text>
          <View style={{ marginLeft: "auto", marginRight: 5 }}>
            <NewNoteMenu addNote={addNote} />
          </View>
        </View>
        <Horizontal style={{ borderWidth: 2, opacity: 0.6 }} />
        <View style={styles.noteBannersContainer}>
          {notes.items.map((x: any) => (
            <NoteBanner
              title={x.title}
              onPress={() => setFocussedNote(x)}
              noteType={x.type}
              onDelete={() => removeNote(x.title)}
            />
          ))}
        </View>
      </View>
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
  noteBannersContainer: {},
});
