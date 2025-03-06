import { useEffect, useMemo, useState } from 'react';
import { View, Text, TouchableWithoutFeedback, TouchableOpacity, TextInput, Keyboard, StyleSheet } from 'react-native';

import Entypo from 'react-native-vector-icons/Entypo';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import { NoteUsersModal } from './NoteUsersModal';

import { BouncyPressable } from '@/components/BouncyPressable';
import { CollaborativeIcon } from '@/components/CollaborativeIcon';
import { Loader } from '@/components/Loader';
import { NewNoteMenu } from '@/components/NewNoteAdd';
import { ID } from '@/schema/database/abstract';
import { NoteType } from '@/schema/database/notes';
import { UserRelatedNote } from '@/schema/user'
import { useNoteStore } from '@/store/useNoteStore';
import { useRootComponentStore } from '@/store/useRootComponent';
import { black, blackWithOpacity, primaryGreen, white } from '@/utils/colours';

type Props = {
  initialTitle: string;
  loading: boolean;
  note: UserRelatedNote | null,
  totalNotes: number,
  onBack: () => void;
  setNoteId: (id: ID) => void;
}

const defaultTitleMap: Record<NoteType, string> = {
  [NoteType.ListOnly]: 'New List',
  [NoteType.NoteOnly]: 'New Note',
  [NoteType.Folder]: 'New Folder'
}

export const NoteHeader = ({ initialTitle, loading, note, totalNotes, onBack, setNoteId }: Props) => {
  const { updateModal } = useRootComponentStore();
  const { updateNote, addNote } = useNoteStore();

  const newNote = (type: NoteType, parent_id?: ID) => {
    addNote(defaultTitleMap[type], type, totalNotes, parent_id).then((id: ID) => setNoteId(id));
  };

  const [title, setTitle] = useState(initialTitle);

  const isNewNote = useMemo(() =>
    initialTitle === 'New List' ||
    initialTitle === 'New Note',
  [initialTitle]);

  useEffect(() => {
    setTitle(initialTitle);
  }, [initialTitle])

  if (note === null) { // must be root
    return (
      <View style={styles.noteHeader}>
        <MaterialCommunityIcons name='note-multiple' size={28} color={white} />
        <Text style={styles.myNotesTitle}>{title}</Text>
        <View
          style={styles.newNoteContainer}
        >
          {loading && (
            <Loader size={28} color={white} />
          )}
          {!loading && (
            <NewNoteMenu newNote={(type: NoteType) => newNote(type)}/>
          )}
        </View>
      </View>
    )
  }

  const updateTitle = () => updateNote(note, { title });

  const openUserModal = () => {
    if (!note.relations?.users) {
      console.error('Users should be loaded with notes');
      return;
    }

    updateModal(<NoteUsersModal note={note} users={note.relations.users} />)
  }

  const conditionalStyles = {
    collaborative: { opacity: note.collaborative ? 1 : 0.5 }
  }

  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <View style={styles.noteHeader}>
        <TouchableOpacity onPress={onBack}>
          <Entypo name={'chevron-left'} size={30} color='white' />
        </TouchableOpacity>

        <TextInput
          autoFocus={isNewNote}
          value={title}
          style={styles.noteTitle}
          onChangeText={(text) => setTitle(text)}
          onSubmitEditing={updateTitle}
          onEndEditing={updateTitle}
          returnKeyType="done"
          spellCheck={false}
        />

        <View style={styles.headerLeft}>
          {note.type === NoteType.ListOnly && (
            <Text style={styles.subtitle}>
              ({note.relations.items?.length || 0} Items)
            </Text>
          )}

          {loading && (
            <Loader size={28} color={white} />
          )}
          {!loading && (
            <BouncyPressable onPress={() => openUserModal()} containerStyle={conditionalStyles.collaborative}>
              <CollaborativeIcon entity={note} type='note' />
            </BouncyPressable>
          )}
          {!loading && note.type === NoteType.Folder && (
            <NewNoteMenu newNote={(type: NoteType) => newNote(type, note.id)}/>
          )}
        </View>
      </View>
    </TouchableWithoutFeedback>
  )
}

const styles = StyleSheet.create({
  noteHeader: {
    alignItems: 'center',
    backgroundColor: primaryGreen,
    flexDirection: 'row',
    gap: 12,
    height: 60,
    paddingHorizontal: 10,

    shadowColor: black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 2,
    zIndex: 50
  },
  myNotesTitle: {
    color: white,
    fontFamily: 'Lexend',
    fontSize: 20,
    fontWeight: '400'
  },

  newNoteContainer: {
    marginLeft: 'auto',
    marginRight: 5
  },

  headerLeft: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 10,
    marginLeft: 'auto'
  },

  noteTitle: {
    backgroundColor: blackWithOpacity(0.1),
    borderRadius: 4,
    color: white,
    fontFamily: 'Lexend',
    fontSize: 20,
    fontWeight: '400',
    minWidth: '50%',
    maxWidth: '50%',
    padding: 8
  },

  subtitle: {
    color: white,
    fontSize: 15,
    fontWeight: '600',
    opacity: 0.6,
    textAlign: 'center'
  }
})
