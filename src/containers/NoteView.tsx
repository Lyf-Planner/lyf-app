import { StyleSheet, View, Text } from 'react-native';

import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

import { InviteHandler } from '@/components/InviteHandler';
import { Loader } from '@/components/Loader';
import { NoteBody } from '@/containers/NoteBody';
import { ID } from '@/schema/database/abstract';
import { UserRelatedNote } from '@/schema/user';

type Props = {
  loading: boolean,
  note: UserRelatedNote,
  onBack: () => void;
  setNoteId: (note_id: ID) => void;
}

export const NoteView = ({
  loading,
  note,
  onBack,
  setNoteId
}: Props) => {
  const conditionalStyles = {
    scrollView: {
      paddingVertical: note.invite_pending ? 10 : 20
    }
  }

  return (
    <View style={styles.main}>
      {loading &&
        <View style={styles.loadingContainer}>
          <Loader />
          <Text style={styles.loadingText}>
            Organizing...
          </Text>
        </View>
      }

      {!loading && (
        <KeyboardAwareScrollView
          style={[styles.scrollView, conditionalStyles.scrollView]}
          contentContainerStyle={styles.scrollContainer}
        >
          {note.invite_pending && (
            <View style={styles.inviteHandleWrapper}>
              <InviteHandler entity={note} type='note' />
            </View>
          )}
          <NoteBody note={note} setNoteId={setNoteId} />
        </KeyboardAwareScrollView>
      )}
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
  inviteHandleWrapper: {
    width: '100%',
    maxWidth: 500,
    alignSelf: 'center'
  },
  scrollContainer: {
    flexDirection: 'column',
    gap: 10
  },
  scrollView: {
    paddingHorizontal: 20,
    width: '100%'
  }
});
