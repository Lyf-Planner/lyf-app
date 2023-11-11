import { StyleSheet, View, TextInput, Text } from "react-native";
import { Horizontal } from "../../components/MiscComponents";

import Entypo from "react-native-vector-icons/Entypo";
import { TouchableOpacity } from "react-native-gesture-handler";
import { NoteTypes } from "./TypesAndHelpers";
import { ListInput } from "../../components/list/ListInput";
import { useState } from "react";
import { eventsBadgeColor, primaryGreen } from "../../utils/constants";

export const NoteView = ({ note, onBack, initialising, updateNote }) => {
  const [editedNoteTitle, updateEditedNoteTitle] = useState(note.title);

  const updateNoteTitle = (title: string) => {
    updateNote({ ...note, title });
  };
  const updateNoteContent = (content: string) => {
    updateNote({ ...note, content });
  };

  return (
    <View>
      <View style={styles.myNotesHeader}>
        <TouchableOpacity onPress={() => onBack()}>
          <Entypo name={"chevron-left"} size={30} />
        </TouchableOpacity>
        <TextInput
          autoFocus={initialising}
          style={styles.myNotesTitle}
          onChangeText={(text) => updateNoteTitle(text)}
          defaultValue={note.title}
          returnKeyType="done"
        />
        
      </View>
      <Horizontal style={{ marginBottom: 8, borderWidth: 2, opacity: 0.6 }} />
      {note.type === NoteTypes.Text ? (
        <TextInput
          multiline={true}
          defaultValue={note.content}
          style={{
            borderWidth: 1,
            borderColor: "black",
            borderRadius: 10,
            height: 400,
            paddingHorizontal: 8,
            paddingVertical: 10,
          }}
          onChangeText={(text) => updateNoteContent(text)}
        />
      ) : (
        <ListInput
          list={note.content || []}
          updateList={updateNoteContent}
          placeholder="New item +"
          badgeColor={eventsBadgeColor}
          badgeTextColor="black"
          listBackgroundColor="rgba(0,0,0,0.02)"
          listWrapperStyles={{ padding: 5 }}
          isEvents
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  myNotesHeader: {
    flexDirection: "row",
    height: 40,
    alignItems: "center",
    marginTop: 8,
    marginBottom: 8,
  },
  myNotesTitle: { fontSize: 22, fontWeight: "700", width: "80%" },
});
