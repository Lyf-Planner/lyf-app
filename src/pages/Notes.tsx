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

export const Notes = (props: BottomTabScreenProps<RouteParams>) => {
  const { loading, notes, rootNotes, loadNote } = useNoteStore();

  // this only pertains to the first navigation to notes, not note-to-note navigation
  const [path, setPath] = useState<string>('root');
  const selectedId = useMemo(() => {
    const pathArray = path.split('/');
    return pathArray[pathArray.length - 1];
  }, [path])

  console.log('path is', path);

  useEffect(() => {
    // if root, the note store initialises with root notes, just wait
    if (selectedId === 'root') {
      return
    }
    loadNote(selectedId);
  }, [selectedId]);

  useEffect(() => {
    if (props.route.params?.id) {
      // prevent appending if already the main view
      const pathArray = path.split('/');
      if (pathArray[pathArray.length - 1] === props.route.params?.id) {
        return;
      }

      setPath(`${path}/${props.route.params?.id}`)
    }
  }, [props.route.params?.id])

  const loadedNote = useMemo(() => selectedId === 'root' ? null : notes[selectedId], [selectedId, notes]);
  const noteCollection = useMemo(() => {
    const rootCollection = selectedId === 'root';
    const folderCollection = loadedNote && loadedNote.type === NoteType.Folder;

    // use undefined if waiting, null if not yet applicable
    if (folderCollection) {
      return loadedNote.relations.notes ?? null;
    } else if (rootCollection) {
      return notes ? rootNotes.map((id) => notes[id]) : null;
    }

    return undefined;
  }, [notes, loadedNote, loading]);

  console.log(noteCollection?.map((x) => x.id))

  const visitNote = (id: ID) => {
    setPath(`${path}/${id}`);
  }

  const backtrack = () => {
    let pathArray = path.split('/');
    pathArray.pop()

    if (pathArray.length === 1 && pathArray[0] !== 'root') {
      // this happens when we go directly to a note from something like a notification, just go back to root.
      pathArray = ['root'];
    }

    setPath(pathArray.join('/'));
  }

  let body: JSX.Element;
  if (noteCollection && (loadedNote || selectedId === 'root')) {
    body = (
      <NoteCollection
        parent={loadedNote}
        notes={noteCollection || []}
        loading={!noteCollection}
        setNoteId={visitNote}
      >

      </NoteCollection>
    );
  } else if (loadedNote) {
    body = (
      <NoteView
        note={loadedNote}
        loading={!loadedNote}
        onBack={backtrack}
        setNoteId={visitNote}
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
        onBack={backtrack}
        setNoteId={visitNote}
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
