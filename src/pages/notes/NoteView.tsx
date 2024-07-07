import { StyleSheet, View, TextInput, Text } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { List } from '../../components/list/List';
import { eventsBadgeColor } from 'utils/colours';

import { ID } from 'schema/database/abstract';
import { useNotes } from 'providers/cloud/useNotes';
import { useMemo, useState } from 'react';
import { NoteType } from 'schema/database/notes';
import { NoteHeader } from './containers/NoteHeader';
import { NoteBody } from './containers/NoteBody';

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
  const { notes } = useNotes();

  const note = useMemo(() => notes.find((x) => x.id === id), [notes]);
  if (!note) {
    return null;
  }

  const [initialising, setInitialising] = useState(note.relations.users)

  return (
    <View style={styles.notePageWrapper}>
      <NoteHeader note={note} onBack={onBack}/>
      <NoteBody note={note}/>
    </View>
  );
};

const styles = StyleSheet.create({
  notePageWrapper: {
    paddingHorizontal: 10
  },
});
