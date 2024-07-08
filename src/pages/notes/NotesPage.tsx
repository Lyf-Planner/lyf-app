import { View, Text, StyleSheet } from 'react-native';
import { Horizontal, Loader, PageLoader } from '../../components/general/MiscComponents';
import { useEffect, useState } from 'react';
import { NewNoteMenu } from './containers/NewNoteAdd';
import { NoteView } from './NoteView';
import { NoteRow } from './containers/NoteRow';
import { useNotes } from 'providers/cloud/useNotes';
import { NoteType } from 'schema/database/notes';
import { UserRelatedNote } from 'schema/user';
import { ID } from 'schema/database/abstract';
import { primaryGreen, white } from 'utils/colours';
import Entypo from 'react-native-vector-icons/Entypo';

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
      <View style={styles.main}>
        <View style={styles.myNotesHeader}>
          <Entypo name='list' size={28} color={white} />
          <Text style={styles.myNotesTitle}>All Notes</Text>
          <View 
            style={styles.newNoteContainer} 
          >
            <NewNoteMenu newNote={newNote} />
          </View>
        </View>

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

          {loading && <PageLoader />}
        </View>
      </View>
    );
  }
};

const styles = StyleSheet.create({
  main: {
    backgroundColor: "#EEE",
    flex: 1,
  },
  myNotesHeader: {
    zIndex: 50,
    flexDirection: 'row',
    gap: 12,
    alignItems: 'center',
    height: 65,
    paddingHorizontal: 16,

    backgroundColor: primaryGreen, 
    shadowColor: 'black',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 2
  },
  myNotesTitle: { 
    fontSize: 22, 
    textAlignVertical: 'top',
    color: white, 
    fontFamily: "Lexend", 
    fontWeight: '400',
    position: 'relative',
    bottom: 1
   },
  newNoteContainer: { 
    marginLeft: 'auto', 
    marginRight: 5,
  },
  headerSeperator: { borderWidth: 2, opacity: 0.6, marginHorizontal: 14 },

  noteBannersContainer: {
    minHeight: 100,
    marginTop: 2,
  },
  noNotesText: {
    marginTop: 50,
    paddingHorizontal: 12,
    textAlign: 'center',
    opacity: 0.4,
    fontSize: 18,
    fontFamily: 'Lexend'
  },

  loadingContainer: {
    marginTop: 50,
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
