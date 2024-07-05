import { View, Text, StyleSheet } from 'react-native';
import { Horizontal, Loader } from '../../components/general/MiscComponents';
import { useEffect, useState } from 'react';
import { NewNoteMenu } from './containers/NewNoteAdd';
import { NoteView } from './NoteView';
import { NoteRow } from './containers/NoteRow';
import { useNotes } from 'providers/cloud/useNotes';
import { NoteType } from 'schema/database/notes';
import { UserRelatedNote } from 'schema/user';
import { ID } from 'schema/database/abstract';

export const Notes = () => {
  // Can be the ID of a folder or note, the manager will figure it out
  const [selectedId, setSelectedId] = useState<ID | null>(null);
  const { loading, reload, notes, updateNote, addNote } = useNotes();

  useEffect(() => {
    reload();
  }, []);

  const newNote = (type: NoteType) => {
    const title = `New ${type === NoteType.ListOnly ? 'List' : 'Note'}`;
    addNote(title, type).then((id: ID) => setSelectedId(id));
  };

  if (selectedId) {
    return (
      <NoteView
        id={selectedId}
        onBack={() => setSelectedId(null)}
        updateSelected={(id: ID) => setSelectedId(id)}
      />
    );
  } else {
    return (
      <View>
        <View style={styles.myNotesHeader}>
          <Text style={styles.myNotesTitle}>My Notes</Text>
          <View style={styles.newNoteContainer}>
            <NewNoteMenu newNote={newNote} />
          </View>
        </View>
        <Horizontal
          style={styles.headerSeperator}
        />
        <View style={styles.noteBannersContainer}>
          {!loading &&
            <View>
              {notes.length > 0 &&
                notes.map((x) => (
                  <NoteRow
                    note={x}
                    onSelect={() => setSelectedId(x.id)}
                    key={x.id}
                  />
                ))
              } 

              {notes.length === 0 &&
                <Text style={styles.noNotesText}>No notes created yet :)</Text>
              }
            </View>
          }

          {loading &&
            <View style={styles.loadingContainer}>
              <Loader size={50} />
            </View>
          }
        </View>
      </View>
    );
  }
};

const styles = StyleSheet.create({
  myNotesHeader: {
    flexDirection: 'row',
    height: 40,
    alignItems: 'center',
    paddingHorizontal: 16,
    marginTop: 8,
    marginBottom: 8
  },
  myNotesTitle: { fontSize: 24, fontWeight: '700', fontFamily: 'InterSemi' },
  newNoteContainer: { marginLeft: 'auto', marginRight: 5 },
  headerSeperator: { borderWidth: 2, opacity: 0.6, marginHorizontal: 12 },
  
  noteBannersContainer: {
    paddingHorizontal: 12,
    minHeight: 100
  },
  noNotesText: {
    paddingTop: 45,
    paddingHorizontal: 12,
    textAlign: 'center',
    opacity: 0.4,
    fontWeight: '600',
    fontSize: 16
  },
  loadingContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1
  }
});
