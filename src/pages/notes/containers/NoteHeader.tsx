import * as Native from 'react-native';
import { UserRelatedNote } from "schema/user"
import { NoteTypeBadge, TYPE_TO_DISPLAY_NAME } from './NoteTypeBadge';
import Entypo from 'react-native-vector-icons/Entypo';
import { NoteType } from 'schema/database/notes';
import { useMemo, useState } from 'react';
import { useNotes } from 'providers/cloud/useNotes';
import { primaryGreen, white } from 'utils/colours';

type Props = {
  note: UserRelatedNote,
  onBack: () => void;
}

export const NoteHeader = ({ note, onBack }: Props) => {
  const { updateNote } = useNotes();
  const [title, setTitle] = useState(note.title);

  const isNewNote = useMemo(() => 
    note.title === 'New List' || 
    note.title === 'New Note',
  [note.title]);

  const updateTitle = () => updateNote(note, { title });

  return (
    <Native.TouchableWithoutFeedback onPress={() => Native.Keyboard.dismiss()}>
    <Native.View style={styles.noteHeader}>
      <Native.TouchableOpacity onPress={onBack}>
        <Entypo name={'chevron-left'} size={30} color='white' />
      </Native.TouchableOpacity>
  
      <Native.TextInput
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

      <Native.View style={styles.headerLeft}>
        {note.type === NoteType.ListOnly && (
          <Native.Text style={styles.subtitle}>
            ({note.relations.items?.length || 0} Items)
          </Native.Text>
        )}

        <NoteTypeBadge type={note.type} />
      </Native.View>
    </Native.View>
    </Native.TouchableWithoutFeedback>
  )
}

const styles = Native.StyleSheet.create({
  noteHeader: {
    backgroundColor: primaryGreen,
    flexDirection: 'row',
    paddingHorizontal: 10,
    gap: 8,
    height: 65,
    alignItems: 'center',

    shadowColor: 'black',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 2
  },

  headerLeft: {
    marginLeft: 'auto',
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center'
  },

  noteTitle: { 
    fontSize: 22, 
    maxWidth: 275,
    color: white, 
    fontFamily: "Lexend", 
    fontWeight: '400',
    
    backgroundColor: 'rgba(0,0,0,0.1)',
    padding: 8,
    borderRadius: 4,
  },

  subtitle: {
    textAlign: 'center',
    opacity: 0.6,
    fontWeight: '600',
    fontSize: 15,
    color: 'white'
  }
})