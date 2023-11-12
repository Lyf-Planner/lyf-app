import { View, Text, StyleSheet } from "react-native";
import { Horizontal } from "../../components/MiscComponents";
import { useState } from "react";
import { NewNoteMenu } from "./NewNoteAdd";
import {
  TypeToDisplayName,
  updateNote,
  addNote,
  removeNote,
} from "./TypesAndHelpers";
import { NoteView } from "./NoteView";
import { NoteBanner } from "./NoteBanner";

export const Notes = ({ notes, updateNotes }: any) => {
  const [focussedNote, setFocussedNote] = useState(null);

  const newNote = (noteType, newNoteName?) => {
    var newNote = addNote(notes, updateNotes, noteType, newNoteName);
    setFocussedNote(newNote);
  };
  const deleteNote = (id) => removeNote(notes, updateNotes, id);
  const modifyNote = (updatedNote) =>
    updateNote(notes, updateNotes, focussedNote.id, updatedNote);

  if (focussedNote)
    return (
      <NoteView
        note={focussedNote}
        onBack={() => setFocussedNote(null)}
        initialising={
          focussedNote.title === `New ${TypeToDisplayName[focussedNote.type]}`
        }
        updateNote={modifyNote}
      />
    );
  else
    return (
      <View>
        <View style={styles.myNotesHeader}>
          <Text style={styles.myNotesTitle}>My Notes</Text>
          <View style={{ marginLeft: "auto", marginRight: 5 }}>
            <NewNoteMenu addNote={newNote} />
          </View>
        </View>
        <Horizontal style={{ borderWidth: 2, opacity: 0.6 }} />
        <View style={styles.noteBannersContainer}>
          {notes.items.map((x: any) => (
            <NoteBanner
              title={x.title}
              onPress={() => setFocussedNote(x)}
              noteType={x.type}
              key={x.id}
              onDelete={() => deleteNote(x.id)}
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
