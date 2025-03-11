import { useCallback, useMemo } from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';

import DraggableFlatList, { DragEndParams, RenderItemParams } from 'react-native-draggable-flatlist';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import { BouncyPressable } from '@/components/BouncyPressable';
import { Horizontal } from '@/components/Horizontal';
import { InviteHandler } from '@/components/InviteHandler';
import { NoteRow } from '@/components/NoteRow';
import { ID } from '@/schema/database/abstract';
import { NoteType } from '@/schema/database/notes';
import { ChildNote } from '@/schema/notes';
import { UserRelatedNote } from '@/schema/user'
import { useNoteStore } from '@/store/useNoteStore';
import { black, deepBlue, eventsBadgeColor, primaryGreen, white } from '@/utils/colours';
import { isChildNote, isUserRelatedNote } from '@/utils/note';

type Props = {
  notes: UserRelatedNote[] | ChildNote[],
  loading: boolean,
  parent: UserRelatedNote | null,
  setNoteId: (id: ID, isFolder?: boolean) => void;
}

export const NoteCollection = ({ notes, loading, parent, setNoteId }: Props) => {
  const { moving, sorting, moveNote, setMoving, setSorting, sortNotes } = useNoteStore();

  const sortedNotes = useMemo(() => notes.sort((a, b) => {
    if (isChildNote(a) && isChildNote(b)) {
      return a.sorting_rank - b.sorting_rank;
    }

    if (isUserRelatedNote(a) && isUserRelatedNote(b)) {
      return a.sorting_rank_preference - b.sorting_rank_preference;
    }

    return 0;
  }), [notes]);

  const onDragEnd = ({ data: notes }: DragEndParams<UserRelatedNote | ChildNote>) => {
    sortNotes(parent ? parent.id : 'root', notes.map((note) => note.id));
  };

  const noteKey = useCallback((note: UserRelatedNote | ChildNote) => {
    if (!note) {
      return '';
    }

    if (isChildNote(note)) {
      return note.id + note.sorting_rank;
    }

    return note.id + note.sorting_rank_preference;
  }, [sortedNotes]);

  const conditionalStyles = {
    scrollContainer: {
      paddingVertical: parent && parent.invite_pending ? 10 : 20
    }
  };

  const body = useMemo(() => {
    if (sorting) {
      return (
        <DraggableFlatList<UserRelatedNote | ChildNote>
          contentContainerStyle={styles.noteRowWrapper}
          style={styles.flatlistInternal}
          autoscrollThreshold={100}
          data={sortedNotes}
          onDragEnd={onDragEnd}
          keyExtractor={noteKey}
          renderItem={(note: RenderItemParams<UserRelatedNote | ChildNote>) => {
            return (
              <NoteRow
                key={noteKey(note.item)} // not to be confused with a Lyf item - this 'item' is a key from the draggable flatlist library
                note={note.item}
                parent={parent}
                onSelect={() => null}
                onDrag={note.drag}
              />
            );
          }}
        />
      )
    }

    return (
      <View style={styles.noteRowWrapper}>
        {sortedNotes.map((x) => (
          <NoteRow
            key={x.id}
            note={x}
            parent={parent}
            onSelect={() => setNoteId(x.id, x.type === NoteType.Folder)}
          />
        ))}

        {sortedNotes.length === 0 &&
          <Text style={styles.noNotesText}>No notes created yet :)</Text>
        }
      </View>
    )
  }, [sorting, sortedNotes]);

  return (
    <ScrollView style={styles.noteBannersContainer}>
      <View style={[styles.scrollContainer, conditionalStyles.scrollContainer]}>
        {parent && parent.invite_pending && <InviteHandler entity={parent} type='note' />}
        {!loading && body}
        {(sorting || moving) && <Horizontal />}
        {(sorting || moving) && (
          <View style={styles.movingButtons}>
            {moving && (
              <BouncyPressable // TODO LYF-666: I can't press the entire thing
                style={styles.sortingButtonInternal}
                onPress={() => {
                  moveNote(moving, parent ? parent.id : 'root')
                }}
                containerStyle={styles.moveButton}
              >
                <MaterialCommunityIcons name="folder-check" size={22} color={white} />
                <Text style={styles.moveText}>Move Here</Text>
              </BouncyPressable>
            )}
            {(sorting || moving) && (
              <BouncyPressable // TODO LYF-666: I can't press the entire thing
                style={styles.sortingButtonInternal}
                onPress={() => {
                  setSorting(false);
                  setMoving(null, null);
                }}
                containerStyle={styles.sortingDoneButton}
              >
                <Text style={styles.sortingDoneText}>{sorting ? 'Done' : 'Cancel'}</Text>
              </BouncyPressable>
            )}
          </View>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  flatlistInternal: {
    overflow: 'visible'
  },
  moveButton: {
    borderColor: black,
    borderWidth: 1,
    backgroundColor: primaryGreen,
    borderRadius: 10,
    padding: 12,
    flexDirection: 'row',
    justifyContent: 'center',
    flex: 1
  },
  moveText: {
    color: white,
    fontFamily: 'Lexend',
    fontSize: 18,
    fontWeight: '500',
    height: 'auto',
    textAlign: 'center'
  },
  movingButtons: {
    flexDirection: 'row',
    gap: 4

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
    width: '100%',
    height: 'auto'
  },
  scrollContainer: {
    alignSelf: 'center',
    flexDirection: 'column',
    gap: 10,
    marginBottom: 300,
    maxWidth: 500,
    overflow: 'visible',
    paddingHorizontal: 20,
    width: '100%'
  },
  sortingButtonInternal: {
    height: '100%',
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4
  },
  sortingDoneButton: {
    borderColor: deepBlue,
    borderWidth: 0.5,
    backgroundColor: eventsBadgeColor,
    borderRadius: 10,
    padding: 12,
    flexDirection: 'row',
    justifyContent: 'center',
    flex: 1
  },
  sortingDoneText: {
    color: deepBlue,
    fontFamily: 'Lexend',
    fontSize: 18,
    fontWeight: '500',
    width: '100%',
    height: 'auto',
    textAlign: 'center'
  }
});
