import { useEffect, useMemo, useState } from 'react';
import { StyleSheet, View, TextInput, Text, ScrollView } from 'react-native';

import { Loader } from 'components/Loader';
import { NoteBody } from 'containers/NoteBody';
import { NoteHeader } from 'containers/NoteHeader';
import { PageBackground } from 'containers/PageBackground';
import { useNotes } from 'hooks/cloud/useNotes';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { ID } from 'schema/database/abstract';

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
  loadingContainer: {
    alignItems: 'center',
    flexDirection: 'column',
    gap: 10,
    justifyContent: 'center',
    marginTop: 20
  },

  loadingText: {
    fontFamily: 'Lexend',
    fontSize: 20
  },

  main: { flex: 1 },
  notePageWrapper: {
    overflow: 'visible'
  },
  scrollView: {
    height: '100%',
    paddingHorizontal: 20,
    paddingVertical: 10,
    width: '100%'
  }

});
