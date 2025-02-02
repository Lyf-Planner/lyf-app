import { StyleSheet, View, Text } from 'react-native';

import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

import { InviteHandler } from '@/components/InviteHandler';
import { Loader } from '@/components/Loader';
import { NoteBody } from '@/containers/NoteBody';
import { ID } from '@/schema/database/abstract';
import { UserRelatedNote } from '@/schema/user';

type Props = {
  note: UserRelatedNote,
  loading: boolean,
  onBack: () => void;
  setNoteId: (note_id: ID) => void;
}

export const NoteView = ({
  note,
  loading,
  onBack,
  setNoteId
}: Props) => {
  return (
    <View style={styles.main}>
      <View style={styles.notePageWrapper}>
        {loading &&
          <View style={styles.loadingContainer}>
            <Loader />
            <Text style={styles.loadingText}>
              Organizing...
            </Text>
          </View>
        }

        {!loading && (
          <KeyboardAwareScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContainer}>
            {note.invite_pending && <InviteHandler entity={note} type='note' />}
            <NoteBody note={note} setNoteId={setNoteId} />
          </KeyboardAwareScrollView>
        )}
      </View>
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
