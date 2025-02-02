import { View, Text, ScrollView, StyleSheet } from 'react-native';

import { NoteRow } from '@/components/NoteRow';
import { PageLoader } from '@/components/PageLoader';
import { ID } from '@/schema/database/abstract';
import { NoteType } from '@/schema/database/notes';
import { UserRelatedNote } from '@/schema/user'

type Props = {
  notes: UserRelatedNote[],
  loading: boolean,
  setNoteId: (id: ID, isFolder?: boolean) => void;
}

export const NoteCollection = ({ notes, loading, setNoteId }: Props) => {
  return (
    <ScrollView style={styles.noteBannersContainer}>
      <View style={styles.scrollContainer}>
        {!loading &&
          <View style={styles.noteRowWrapper}>
            {Object.values(notes).map((x) => (
              <NoteRow
                note={x}
                onSelect={() => setNoteId(x.id, x.type === NoteType.Folder)}
                key={x.id}
              />
            ))}

            {Object.values(notes).length === 0 &&
              <Text style={styles.noNotesText}>No notes created yet :)</Text>
            }
          </View>
        }

        {loading && <PageLoader />}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  noNotesText: {
    fontFamily: 'Lexend',
    fontSize: 18,
    marginTop: 50,
    opacity: 0.4,
    paddingHorizontal: 12,
    textAlign: 'center'
  },
  noteBannersContainer: {
    minHeight: 100
  },

  noteRowWrapper: {
    alignSelf: 'center',
    flexDirection: 'column',
    gap: 8,
    maxWidth: 500,
    width: '100%',
    height: '100%'
  },
  scrollContainer: {
    alignSelf: 'center',
    flexDirection: 'column',
    marginBottom: 300,
    maxWidth: 450,
    padding: 20,
    width: '100%'
  }
});
