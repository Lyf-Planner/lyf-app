import { StyleSheet, View, TextInput, Text, ScrollView } from 'react-native';

import { ID } from 'schema/database/abstract';
import { useNotes } from 'providers/cloud/useNotes';
import { useEffect, useMemo, useState } from 'react';
import { NoteHeader } from './containers/NoteHeader';
import { NoteBody } from './containers/NoteBody';
import { Loader } from 'components/general/MiscComponents';
import { PageBackground } from 'components/general/PageBackground';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { primaryGreen } from 'utils/colours';

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
    <View style={styles.main}>
      <NoteHeader note={note} onBack={onBack}/>
      <PageBackground noPadding>
        <View style={styles.notePageWrapper}>
          {initialising && 
            <View style={styles.loadingContainer}>
              <Loader />
              <Text style={styles.loadingText}>
                Organizing...
              </Text>
            </View>
          }
          
          {!initialising &&
            <KeyboardAwareScrollView style={styles.scrollView}>
              <NoteBody note={note}/>
            </KeyboardAwareScrollView>
          } 
        </View>
      </PageBackground>
    </View>
  );
};

const styles = StyleSheet.create({
  main: { flex: 1 },

  notePageWrapper: {
    overflow: 'visible',
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
  scrollView: { 
    width: '100%', 
    height: '100%', 
    paddingHorizontal: 20,
    paddingVertical: 10, 
  }

});
