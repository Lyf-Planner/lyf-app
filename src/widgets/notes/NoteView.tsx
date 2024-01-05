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
  sleep,
} from "../../utils/constants";
import { NoteTypeBadge } from "./NoteTypeBadge";
import { ListItemType } from "../../components/list/constants";
import { useAuth } from "../../authorisation/AuthProvider";
import { v4 as uuid } from "uuid";

export const NoteView = ({
  note,
  onBack,
  justCreated,
  updateNote,
  publishUpdate,
}) => {
  const { user } = useAuth();
  const updateNoteTitle = (title: string) => {
    updateNote({ ...note, title });
  };
  const updateNoteContent = (content) => {
    updateNote({ ...note, content });
  };

  // We need to pass different item ops to the ListInput
  // Since the list items are stored on note.content
  const addItem = (title: string) => {
    const newItem = {
      id: uuid(),
      title,
      type: ListItemType.Task,
      permitted_users: [{ user_id: user.id, permissions: "Owner" }],
    };
    updateNoteContent([...note.content, newItem]);
    sleep(100);
    publishUpdate();
  };
  const updateItem = (item) => {
    var tmp = [...note.content];
    var i = tmp.findIndex((x) => x.id === item.id);
    tmp[i] = item;
    updateNoteContent(tmp);
    sleep(100);
    publishUpdate();
  };
  const removeItem = (item) => {
    var tmp = note.content.filter((x) => x.id !== item.id);
    updateNoteContent(tmp);
    sleep(100);
    publishUpdate();
  };

  return (
    <View style={styles.notePageWrapper}>
      <View style={styles.myNotesHeader}>
        <TouchableOpacity onPress={() => onBack()}>
          <Entypo name={"chevron-left"} size={30} />
        </TouchableOpacity>
        <TextInput
          autoFocus={justCreated}
          style={styles.myNotesTitle}
          onChangeText={updateNoteTitle}
          value={note.title}
          onEndEditing={() => publishUpdate()}
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
          onEndEditing={() => publishUpdate()}
        />
      ) : (
        <ListInput
          items={note.content || []}
          type={ListItemType.Item}
          addItem={addItem}
          updateItem={updateItem}
          removeItem={removeItem}
          badgeColor={eventsBadgeColor}
          badgeTextColor="black"
          listBackgroundColor={offWhite}
          listWrapperStyles={{ padding: 5 }}
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
