import { StyleSheet, View, TextInput } from "react-native";
import { Horizontal } from "../../components/MiscComponents";
import { useEffect, useRef } from "react";

export const NoteView = ({ note, onBack, initialising, updateNote }) => {
  const updateNoteTitle = (title: string) => {
    updateNote({ ...note, title });
  };

  const titleRef = useRef<any>();

  useEffect(() => {
    if (initialising) {
      titleRef.current.focus();
    }
  }, [initialising, titleRef]);

  return (
    <View>
      <View style={styles.myNotesHeader}>
        <TextInput
          style={styles.myNotesTitle}
          onChangeText={updateNoteTitle}
          value={note.title}
        />
      </View>
      <Horizontal style={{ marginBottom: 2, borderWidth: 2, opacity: 0.6 }} />
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
  myNotesTitle: { fontSize: 22, fontWeight: "700", width: "80%" },
});
