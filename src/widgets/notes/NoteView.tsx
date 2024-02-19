import { StyleSheet, View, TextInput, Text } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import { NoteTypes } from "./TypesAndHelpers";
import { ListInput } from "../../list/ListInput";
import { eventsBadgeColor } from "../../utils/constants";
import { NoteTypeBadge } from "./NoteTypeBadge";
import { ItemStatus, ListItemType } from "../../list/constants";
import { useAuth } from "../../authorisation/AuthProvider";
import { v4 as uuid } from "uuid";
import Entypo from "react-native-vector-icons/Entypo";

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
  const updateNoteContent = (content, publish = false) => {
    updateNote({ ...note, content });
    publish && publishUpdate({ ...note, content });
  };

  // We need to pass different item ops to the ListInput
  // Since the list items are stored on note.content
  const addItem = (title: string) => {
    const newItem = {
      id: uuid(),
      created: new Date().toISOString(),
      title,
      status: ItemStatus.Upcoming,
      type: ListItemType.Task,
      permitted_users: [{ user_id: user.id, permissions: "Owner" }],
    };
    updateNoteContent([...note.content, newItem], true);
  };
  const updateItem = (item) => {
    var tmp = [...note.content];
    var i = tmp.findIndex((x) => x.id === item.id);
    tmp[i] = item;
    updateNoteContent(tmp, true);
  };
  const removeItem = (item) => {
    var tmp = note.content.filter((x) => x.id !== item.id);
    updateNoteContent(tmp, true);
  };

  return (
    <View style={styles.notePageWrapper}>
      <View style={styles.myNotesHeader}>
        <TouchableOpacity onPress={() => onBack()}>
          <Entypo name={"chevron-left"} size={30} />
        </TouchableOpacity>
        <TextInput
          autoFocus={justCreated}
          onFocus={(e: any) =>
            // Workaround for selectTextOnFocus={true} not working
            e.currentTarget.setNativeProps({
              selection: { start: 0, end: note.title.length },
            })
          }
          style={styles.myNotesTitle}
          onChangeText={updateNoteTitle}
          value={note.title}
          onSubmitEditing={() => publishUpdate(note)}
          onEndEditing={() => publishUpdate(note)}
          returnKeyType="done"
        />
        {note.type === NoteTypes.List && (
          <Text style={[styles.subtitle, { marginLeft: "auto" }]}>
            ({note.content.length} Items)
          </Text>
        )}
        <NoteTypeBadge type={note.type} />
      </View>
      {note.type === NoteTypes.Text ? (
        <TextInput
          multiline={true}
          value={note.content}
          style={styles.noteText}
          onChangeText={updateNoteContent}
          onEndEditing={() => publishUpdate(note)}
        />
      ) : (
        <ListInput
          items={note.content || []}
          type={ListItemType.Item}
          addItem={addItem}
          updateItem={updateItem}
          removeItem={removeItem}
          fromNote
          badgeColor="rgb(30 41 59)"
          badgeTextColor="rgb(203 213 225)"
          listBackgroundColor={eventsBadgeColor}
          listWrapperStyles={{
            paddingHorizontal: 10,
            paddingVertical: 12,
            borderRadius: 10,
          }}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  notePageWrapper: {
    paddingHorizontal: 10,
  },
  myNotesHeader: {
    flexDirection: "row",
    paddingRight: 8,
    gap: 8,
    height: 40,
    alignItems: "center",
    marginTop: 8,
    marginBottom: 2,
  },
  myNotesTitle: { fontSize: 22, fontWeight: "700" },
  noteText: {
    borderWidth: 1,
    marginTop: 6,
    borderColor: "rgba(0,0,0,0.3)",
    backgroundColor: "rgba(0,0,0,0.07)",
    borderRadius: 5,
    fontSize: 16,
    height: 375,
    padding: 8,
    marginBottom: 8,
  },
  subtitle: {
    textAlign: "center",
    opacity: 0.6,
    fontWeight: "600",
    fontSize: 15,
  },
});
