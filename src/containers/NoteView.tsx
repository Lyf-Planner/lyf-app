import { useEffect, useMemo, useState } from 'react';
import { StyleSheet, View, Text } from 'react-native';

import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

import { InviteHandler } from '@/components/InviteHandler';
import { Loader } from '@/components/Loader';
import { NoteBody } from '@/containers/NoteBody';
import { NoteHeader } from '@/containers/NoteHeader';
import { PageBackground } from '@/containers/PageBackground';
import { ID } from '@/schema/database/abstract';
import { useNoteStore } from '@/store/useNoteStore';

type Props = {
  id: ID,
  onBack: () => void;
}

export const NoteView = ({
  id,
  onBack
}: Props) => {
  const { notes, loadNote } = useNoteStore();

  const note = useMemo(() => notes[id], [notes]);
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

          {!initialising && (
            <KeyboardAwareScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContainer}>
              {note.invite_pending && <InviteHandler entity={note} type='note' />}
              <NoteBody note={note}/>
            </KeyboardAwareScrollView>
          )}
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
  scrollContainer: { flexDirection: 'column', gap: 10 },
  scrollView: {
    marginVertical: 6,
    paddingHorizontal: 20,
    paddingVertical: 10,
    width: '100%'
  }
});
