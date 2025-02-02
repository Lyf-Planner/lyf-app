import { useEffect, useMemo, useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';

import { RouteParams } from '@/Routes';
import { NoteCollection } from '@/containers/NoteCollection';
import { NoteHeader } from '@/containers/NoteHeader';
import { NoteView } from '@/containers/NoteView';
import { PageBackground } from '@/containers/PageBackground';
import { ID } from '@/schema/database/abstract';
import { NoteType } from '@/schema/database/notes';
import { useNoteStore } from '@/store/useNoteStore';

type NoteLocation = ID | 'root';

export const Notes = (props: BottomTabScreenProps<RouteParams>) => {
  const { loading, notes, loadNote } = useNoteStore();

  // this only pertains to the first navigation to notes, not note-to-note navigation
  const requestedNote = props.route.params?.id ?? 'root';

  // TODO LYF-146: Turn this into a "path" state
  const [prevId, setPrevId] = useState<NoteLocation>('root');
  const [selectedId, setSelectedId] = useState<NoteLocation>(requestedNote);

  useEffect(() => {
    if (selectedId !== 'root') {
      loadNote(selectedId);
    }
    // if root, the note store initialises with root notes, just wait
  }, [selectedId]);

  const loadedNote = useMemo(() => selectedId === 'root' ? null : notes[selectedId], [selectedId, notes]);
  const noteCollection = useMemo(() => {
    const rootCollection = selectedId === 'root' && notes;
    const folderCollection = loadedNote && loadedNote.type === NoteType.Folder;
    const waiting = (selectedId !== 'root' && !loadedNote) || (selectedId === 'root' && !notes);

    if (waiting) {
      return null;
    } else if (rootCollection) {
      console.debug('returning root collection');
      return Object.values(notes); // TODO LYF-146, this will have bugs when we load in a folders notes
    } else if (folderCollection) {
      return loadedNote.relations.notes || [];
    } else {
      console.debug('note should not have collection')
      return null;
    }
  }, [selectedId, notes, loadedNote, loading]);

  const visitNote = (id: ID) => {
    setPrevId(selectedId);
    setSelectedId(id);
  }

  let body: JSX.Element;
  if (!loadedNote && selectedId !== 'root') {
    console.warn('loading note for the first time');
    body = <></>;
  } else if ((loadedNote || selectedId === 'root') && noteCollection) {
    console.debug('showing note as collection');
    body = (
      <NoteCollection
        notes={noteCollection}
        loading={!noteCollection}
        setNoteId={visitNote} // TODO LYF-146: Append to path
      >

      </NoteCollection>
    );
  } else if (loadedNote && !noteCollection) {
    console.debug('showing note as single note');
    body = (
      <NoteView
        note={loadedNote}
        loading={!loadedNote}
        onBack={() => setSelectedId(prevId)} // TODO LYF-146: Go back in the path
        setNoteId={visitNote} // TODO LYF-146: Append to path
      />
    );
  } else {
    console.error('note state could not be resolved');
    body = <></>;
  }

  return (
    <View style={styles.main}>
      <NoteHeader
        initialTitle={loadedNote?.title || 'All Notes'}
        note={loadedNote}
        loading={loading || !loadedNote}
        onBack={() => setSelectedId(prevId)} // TODO LYF-146: Go back in the path
        setNoteId={visitNote} // TODO LYF-146: Append to path
      />
      <PageBackground noPadding>
        {body}
      </PageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  main: {
    flex: 1,
    flexDirection: 'column'
  }
})
