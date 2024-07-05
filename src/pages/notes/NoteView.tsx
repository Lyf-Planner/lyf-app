import { StyleSheet, View, TextInput, Text } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { List } from '../../components/list/List';
import { eventsBadgeColor } from 'utils/colours';

import { ID } from 'schema/database/abstract';
import { useNotes } from 'providers/cloud/useNotes';
import { useMemo } from 'react';
import { NoteType } from 'schema/database/notes';
import { NoteHeader } from './containers/NoteHeader';

type Props = {
  id: ID,
  onBack: () => void;
  updateSelected: (id: ID) => void;
}

export const NoteView = ({
  id,
  onBack,
  updateSelected
}: Props) => {
  const { notes, updateNote } = useNotes();

  const note = useMemo(() => notes.find((x) => x.id === id), [notes]);
  if (!note) {
    return null;
  }

  const updateNoteTitle = (title: string) => {
    updateNote(note, { title });
  };
  const updateNoteContent = (content: string, publish = false) => {
    updateNote(note, { content });
    // TODO: Put into own section
  };

  return (
    <View style={styles.notePageWrapper}>
      <NoteHeader note={note} onBack={onBack}/>

      {note.type === NoteType.NoteOnly ? (
        <TextInput
          multiline={true}
          value={note.content}
          style={styles.noteText}
          onChangeText={updateNoteContent}
          onEndEditing={() => publishUpdate(note)}
        />
      ) : (
        <List
          items={note.content || []}
          itemStyleOptions={{
            itemColor: 'rgb(30 41 59)',
            itemTextColor: 'rgb(203 213 225)'
          }}
          addItem={addItem}
          updateItem={updateItem}
          removeItem={removeItem}
          fromNote
          listWrapperStyles={{
            paddingHorizontal: 10,
            paddingVertical: 12,
            borderRadius: 10,
            backgroundColor: eventsBadgeColor
          }}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  notePageWrapper: {
    paddingHorizontal: 10
  },

  noteText: {
    borderWidth: 1,
    marginTop: 6,
    borderColor: 'rgba(0,0,0,0.3)',
    backgroundColor: 'rgba(0,0,0,0.07)',
    borderRadius: 5,
    fontSize: 16,
    height: 375,
    padding: 8,
    marginBottom: 8
  },
});
