import { StyleSheet, View, TextInput, Text } from "react-native";
import { Horizontal } from "../../components/MiscComponents";

import Entypo from "react-native-vector-icons/Entypo";
import { TouchableOpacity } from "react-native-gesture-handler";
import { NoteTypes } from "./TypesAndHelpers";
import { ListInput } from "../../components/list/ListInput";
import { useState } from "react";
import {
  eventsBadgeColor,
  offWhite,
  primaryGreen,
} from "../../utils/constants";
import { NoteTypeBadge } from "./NoteTypeBadge";

export const NoteView = ({ note, onBack, initialising, updateNote }) => {
  const updateNoteTitle = (title: string) => {
    updateNote({ ...note, title });
  };
  const updateNoteContent = (content: string) => {
    updateNote({ ...note, content });
  };

  return (
    <View style={styles.notePageWrapper}>
      <View style={styles.myNotesHeader}>
        <TouchableOpacity onPress={() => onBack()}>
          <Entypo name={"chevron-left"} size={30} />
        </TouchableOpacity>
        <TextInput
          autoFocus={initialising}
          style={styles.myNotesTitle}
          onChangeText={updateNoteTitle}
          value={note.title}
          returnKeyType="done"
        />
        <NoteTypeBadge type={note.type} />
      </View>
      {note.type === NoteTypes.Text ? (
        <TextInput
          multiline={true}
          value={note.content}
          style={styles.noteText}
          onChangeText={updateNoteContent}
        />
      ) : (
        <ListInput
          list={note.content || []}
          updateList={updateNoteContent}
          placeholder="New item +"
          badgeColor={eventsBadgeColor}
          badgeTextColor="black"
          listBackgroundColor={offWhite}
          listWrapperStyles={{ padding: 5 }}
          isEvents
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  notePageWrapper: {
    paddingHorizontal: 12,
  },
  myNotesHeader: {
    flexDirection: "row",
    paddingRight: 8,
    height: 40,
    alignItems: "center",
    marginTop: 8,
    marginBottom: 2,
  },
  myNotesTitle: { fontSize: 22, fontWeight: "700", width: "80%" },
  noteText: {
    borderWidth: 0.5,
    marginTop: 6,
    borderColor: "rgba(0,0,0,0.3)",
    backgroundColor: offWhite,
    borderRadius: 5,
    fontSize: 16,
    height: 400,
    padding: 8,
    marginBottom: 8,
  },
});
