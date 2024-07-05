import * as Native from 'react-native';
import { UserRelatedNote } from "schema/user"
import { NoteTypeBadge, TYPE_TO_DISPLAY_NAME } from './NoteTypeBadge';
import Entypo from 'react-native-vector-icons/Entypo';
import { NoteType } from 'schema/database/notes';
import { useMemo, useState } from 'react';
import { useNotes } from 'providers/cloud/useNotes';

type Props = {
  note: UserRelatedNote,
  onBack: () => void;
}

export const NoteHeader = ({ note, onBack }: Props) => {
  const { updateNote } = useNotes();
  const [title, setTitle] = useState(note.title);

  const isNewNote = useMemo(() => note.title === `New ${TYPE_TO_DISPLAY_NAME[note.type]}`, [note.title]);

  const updateTitle = () => updateNote(note, { title });

  return (
    <Native.View style={styles.noteHeader}>
      <Native.TouchableOpacity onPress={onBack}>
        <Entypo name={'chevron-left'} size={30} />
      </Native.TouchableOpacity>
  
      <Native.TextInput
        autoFocus={isNewNote}
        onFocus={(e: any) =>
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

      {note.type === NoteType.ListOnly && (
        <Native.Text style={styles.subtitle}>
          ({note.relations.items?.length || 0} Items)
        </Native.Text>
      )}

      <NoteTypeBadge type={note.type} />
    </Native.View>
  )
}

const styles = Native.StyleSheet.create({
  noteHeader: {
    flexDirection: 'row',
    paddingRight: 8,
    gap: 8,
    height: 40,
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 2
  },

  noteTitle: { fontSize: 22, fontWeight: '700' },

  subtitle: {
    marginLeft: 'auto',
    textAlign: 'center',
    opacity: 0.6,
    fontWeight: '600',
    fontSize: 15
  }
})