import { View, Text, StyleSheet } from "react-native";
import { Horizontal, Loader } from "../../components/MiscComponents";
import { useEffect, useState } from "react";
import { NewNoteMenu } from "./NewNoteAdd";
import { NoteTypes, TypeToDisplayName } from "./TypesAndHelpers";
import { NoteView } from "./NoteView";
import { NoteBanner } from "./NoteBanner";
import { useNotes } from "../../hooks/useNotes";

export const Notes = () => {
  const [focussedNote, setFocussedNote] = useState(null);
  const { notes, initialised, initialise, updateNote, addNote } = useNotes();

  useEffect(() => {
    initialise();
  }, []);

  const newNote = (type: NoteTypes) => {
    let title = `New ${type === NoteTypes.Text ? "Note" : "List"}`;
    addNote(title, type).then((newNote) => setFocussedNote(newNote));
  };

  if (focussedNote)
    return (
      <NoteView
        note={focussedNote}
        onBack={() => setFocussedNote(null)}
        justCreated={
          focussedNote.title === `New ${TypeToDisplayName[focussedNote.type]}`
        }
        updateNote={setFocussedNote}
        publishUpdate={(note) => updateNote(note)}
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
        <Horizontal
          style={{ borderWidth: 2, opacity: 0.6, marginHorizontal: 12 }}
        />
        <View style={styles.noteBannersContainer}>
          {initialised ? (
            <View>
              {notes.length ? (
                notes.map((x) => (
                  <NoteBanner
                    id={x.id}
                    title={x.title}
                    onPress={() => setFocussedNote(x)}
                    noteType={x.type}
                    key={x.id}
                  />
                ))
              ) : (
                <Text style={styles.noNotesText}>No notes created yet :)</Text>
              )}
            </View>
          ) : (
            <View
              style={{
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "center",
                flex: 1,
              }}
            >
              <Loader size={50} />
            </View>
          )}
        </View>
      </View>
    );
};

const styles = StyleSheet.create({
  myNotesHeader: {
    flexDirection: "row",
    height: 40,
    alignItems: "center",
    paddingHorizontal: 16,
    marginTop: 8,
    marginBottom: 8,
  },
  myNotesTitle: { fontSize: 24, fontWeight: "700", fontFamily: "InterSemi" },
  noteBannersContainer: {
    paddingHorizontal: 12,
    minHeight: 100,
  },
  noNotesText: {
    paddingTop: 45,
    paddingHorizontal: 12,
    textAlign: "center",
    opacity: 0.4,
    fontWeight: "600",
    fontSize: 16,
  },
});
