import { StyleSheet, View, TextInput, Text } from 'react-native';

import { ID } from 'schema/database/abstract';
import { useNotes } from 'providers/cloud/useNotes';
import { useEffect, useMemo, useState } from 'react';
import { NoteHeader } from './containers/NoteHeader';
import { NoteBody } from './containers/NoteBody';
import { Loader } from 'components/general/MiscComponents';

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
  const { notes, loadNote } = useNotes();

  const note = useMemo(() => notes.find((x) => x.id === id), [notes]);
  if (!note) {
    return null;
  }

  const [initialising, setInitialising] = useState(!note.relations?.users)

  useEffect(() => {
    if (initialising) {
      loadNote(id).then(() => setInitialising(false));
    }
  }, [])

  return (
    <View style={styles.notePageWrapper}>
      <NoteHeader note={note} onBack={onBack}/>
      {initialising && 
        <View style={styles.loadingContainer}>
          <Loader />
          <Text style={styles.loadingText}>
            Organizing...
          </Text>
        </View>
      }
       
      {!initialising &&
        <NoteBody note={note}/>
      } 
    </View>
  );
};

const styles = StyleSheet.create({
  notePageWrapper: {
    paddingHorizontal: 10
  },

  loadingContainer: {
    marginTop: 20,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10,
  },
  loadingText: {
    fontFamily: 'Lexend',
    fontSize: 20
  },

});
