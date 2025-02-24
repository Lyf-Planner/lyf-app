import { View, Text, ScrollView, StyleSheet } from 'react-native';

import { InviteHandler } from '@/components/InviteHandler';
import { NoteRow } from '@/components/NoteRow';
import { ID } from '@/schema/database/abstract';
import { NoteType } from '@/schema/database/notes';
import { UserRelatedNote } from '@/schema/user'

type Props = {
  moving: boolean;
  notes: UserRelatedNote[],
  loading: boolean,
  parent: UserRelatedNote | null,
  setNoteId: (id: ID, isFolder?: boolean) => void;
  sorting: boolean;
}

export const NoteCollection = ({ notes, loading, parent, setNoteId }: Props) => {
  const conditionalStyles = {
    scrollContainer: {
      paddingVertical: parent && parent.invite_pending ? 10 : 20
    }
  }

  return (
    <ScrollView style={styles.noteBannersContainer}>
      <View style={[styles.scrollContainer, conditionalStyles.scrollContainer]}>
        {parent && parent.invite_pending && <InviteHandler entity={parent} type='note' />}
        {!loading &&
          <View style={styles.noteRowWrapper}>
            {notes.map((x) => (
              <NoteRow
                key={x.id}
                note={x}
                onSelect={() => setNoteId(x.id, x.type === NoteType.Folder)}
              />
            ))}

            {notes.length === 0 &&
              <Text style={styles.noNotesText}>No notes created yet :)</Text>
            }
          </View>
        }
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
    gap: 10,
    marginBottom: 300,
    maxWidth: 450,
    paddingHorizontal: 20,
    width: '100%'
  }
});
