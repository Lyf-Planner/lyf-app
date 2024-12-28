import { useMemo, useState } from 'react';
import { View, Text, TouchableWithoutFeedback, TouchableOpacity, TextInput, Keyboard, StyleSheet } from 'react-native';

import Entypo from 'react-native-vector-icons/Entypo';

import { NoteUsersModal } from './NoteUsersModal';

import { BouncyPressable } from '@/components/BouncyPressable';
import { CollaborativeIcon } from '@/components/CollaborativeIcon';
import { NoteType } from '@/schema/database/notes';
import { UserRelatedNote } from '@/schema/user'
import { useModal } from '@/shell/useModal';
import { useNoteStore } from '@/store/useNoteStore';
import { black, blackWithOpacity, primaryGreen, white } from '@/utils/colours';

type Props = {
  note: UserRelatedNote,
  onBack: () => void;
}

export const NoteHeader = ({ note, onBack }: Props) => {
  const { updateModal } = useModal();
  const { updateNote } = useNoteStore();
  const [title, setTitle] = useState(note.title);

  const isNewNote = useMemo(() =>
    note.title === 'New List' ||
    note.title === 'New Note',
  [note.title]);

  const updateTitle = () => updateNote(note, { title });

  const openUserModal = () => {
    if (!note.relations?.users) {
      console.error('Users should be loaded with notes');
      return;
    }

    updateModal(<NoteUsersModal note={note} users={note.relations.users} />)
  }

  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <View style={styles.noteHeader}>
        <TouchableOpacity onPress={onBack}>
          <Entypo name={'chevron-left'} size={30} color='white' />
        </TouchableOpacity>

        <TextInput
          autoFocus={isNewNote}
          onFocus={(e) =>
          // Workaround for selectTextOnFocus={true} not working
            e.currentTarget.setNativeProps({
              selection: { start: 0, end: note.title.length }
            })
          }
          value={title}
          style={styles.noteTitle}
          onChangeText={(text) => setTitle(text)}
          onSubmitEditing={updateTitle}
          onEndEditing={updateTitle}
          returnKeyType="done"
        />

        <View style={styles.headerLeft}>
          {note.type === NoteType.ListOnly && (
            <Text style={styles.subtitle}>
              ({note.relations.items?.length || 0} Items)
            </Text>
          )}

          <BouncyPressable onPress={() => openUserModal()}>
            <CollaborativeIcon entity={note} type='note' />
          </BouncyPressable>
        </View>
      </View>
    </TouchableWithoutFeedback>
  )
}

const styles = StyleSheet.create({
  headerLeft: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 10,
    marginLeft: 'auto',
    marginRight: 8
  },

  noteHeader: {
    alignItems: 'center',
    backgroundColor: primaryGreen,
    flexDirection: 'row',
    gap: 8,
    height: 65,
    paddingHorizontal: 10,
    shadowColor: black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 2,
    zIndex: 50
  },

  noteTitle: {
    backgroundColor: blackWithOpacity(0.1),
    borderRadius: 4,
    color: white,
    fontFamily: 'Lexend',
    fontSize: 22,
    fontWeight: '400',
    maxWidth: 275,
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
