import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { PageLoader } from 'components/PageLoader';
import { useEffect, useState } from 'react';
import { NewNoteMenu } from 'components/NewNoteAdd';
import { NoteView } from 'containers/NoteView';
import { NoteRow } from 'components/NoteRow';
import { useNotes } from 'hooks/cloud/useNotes';
import { NoteType } from 'schema/database/notes';
import { ID } from 'schema/database/abstract';
import { primaryGreen, white } from 'utils/colours';
import { PageBackground } from 'containers/PageBackground';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { RouteParams } from 'Routes';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';

export const Notes = (props: BottomTabScreenProps<RouteParams>) => {
  // Can be the ID of a folder or note, the manager will figure it out
  const [selectedId, setSelectedId] = useState<ID | null>(props.route.params?.id || null);
  const { loading, notes, updateNote, addNote } = useNotes();

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
          <MaterialCommunityIcons name='note-multiple' size={28} color={white} />
          <Text style={styles.myNotesTitle}>All Notes</Text>
          <View 
            style={styles.newNoteContainer} 
          >
            <NewNoteMenu newNote={newNote} />
          </View>
        </View>

        <PageBackground noPadding>
          <ScrollView style={styles.noteBannersContainer}>
            <View style={styles.scrollContainer}>
              {!loading &&
                <View style={styles.noteRowWrapper}>
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
          </ScrollView>
        </PageBackground>
      </View>
    );
  }
};

const styles = StyleSheet.create({
  main: {
    backgroundColor: "#EEE",
    flex: 1,
  },
  scrollContainer: {
    alignSelf: 'center',
    flexDirection: "column",
    maxWidth: 450,
    padding: 20,
    width: '100%',
    marginBottom: 300,
  },
  myNotesHeader: {
    zIndex: 50,
    flexDirection: 'row',
    gap: 12,
    alignItems: 'center',
    height: 60,
    paddingHorizontal: 16,

    backgroundColor: primaryGreen, 
    shadowColor: 'black',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 2
  },
  myNotesTitle: { 
    fontSize: 22, 
    color: white, 
    fontFamily: "Lexend", 
    fontWeight: '400',
   },
  newNoteContainer: { 
    marginLeft: 'auto', 
    marginRight: 5,
  },
  headerSeperator: { borderWidth: 2, opacity: 0.6, marginHorizontal: 14 },

  noteBannersContainer: {
    minHeight: 100,
  },
  noteRowWrapper: {
    flexDirection: 'column',
    alignSelf: 'center',
    gap: 8,
    width: '100%',
    maxWidth: 500,
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
