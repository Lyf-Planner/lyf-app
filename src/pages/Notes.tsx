import { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';

import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { RouteParams } from 'Routes';
import { NewNoteMenu } from 'components/NewNoteAdd';
import { NoteRow } from 'components/NoteRow';
import { PageLoader } from 'components/PageLoader';
import { NoteView } from 'containers/NoteView';
import { PageBackground } from 'containers/PageBackground';
import { useNotes } from 'hooks/cloud/useNotes';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { ID } from 'schema/database/abstract';
import { NoteType } from 'schema/database/notes';
import { primaryGreen, white } from 'utils/colours';

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
  headerSeperator: { borderWidth: 2, marginHorizontal: 14, opacity: 0.6 },
  loadingContainer: {
    alignItems: 'center',
    flexDirection: 'column',
    gap: 10,
    justifyContent: 'center',
    marginTop: 50
  },
  loadingText: {
    fontFamily: 'Lexend',
    fontSize: 20
  },
  main: {
    backgroundColor: '#EEE',
    flex: 1
  },
  myNotesHeader: {
    alignItems: 'center',
    backgroundColor: primaryGreen,
    flexDirection: 'row',
    gap: 12,
    height: 60,
    paddingHorizontal: 16,

    shadowColor: 'black',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 2,
    zIndex: 50
  },
  myNotesTitle: {
    color: white,
    fontFamily: 'Lexend',
    fontSize: 22,
    fontWeight: '400'
  },

  newNoteContainer: {
    marginLeft: 'auto',
    marginRight: 5
  },
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
    width: '100%'
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
