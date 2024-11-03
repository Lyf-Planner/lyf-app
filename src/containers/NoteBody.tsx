import { useEffect, useMemo, useRef, useState } from 'react';
import * as Native from 'react-native';

import { MultiTypeNewItem } from 'components/MultiTypeNewItem';
import { List } from 'containers/List';
import { useNotes } from 'hooks/cloud/useNotes';
import { ItemDbObject, ItemType } from 'schema/database/items';
import { NoteType } from 'schema/database/notes'
import { LocalItem } from 'schema/items';
import { UserRelatedNote } from 'schema/user';
import debouncer from 'signature-debouncer';
import { deepBlue, deepBlueOpacity, white } from 'utils/colours';

type Props = {
  note: UserRelatedNote
}

const debounceSignature = 'NoteContent'

export const NoteBody = ({ note }: Props) => {
  const { updateNote } = useNotes();
  const [content, setContent] = useState(note.content);

  const updateContent = () => updateNote(note, { content });

  const initialUpdate = useRef(true);
  useEffect(() => {
    if (initialUpdate.current) {
      initialUpdate.current = false;
      return;
    }

    debouncer.run(updateContent, debounceSignature, 1000)
  }, [content])

  const itemStyle = {
    itemColor: 'rgb(30 41 59)',
    itemTextColor: 'rgb(203 213 225)'
  }

  if (note.type === NoteType.NoteOnly) {
    return (
      <Native.TextInput
        multiline
        value={content}
        style={styles.noteText}
        selectionColor={white}
        onChangeText={setContent}
        onEndEditing={updateContent}
        onSubmitEditing={updateContent}
        onBlur={updateContent}
      />
    )
  }

  if (note.type === NoteType.ListOnly) {
    // Need to spoof these to look like LocalItems, bit of tomfuckery here
    const noteItems: LocalItem[] = useMemo(() => note.relations.items ?
      note.relations.items.map((item: ItemDbObject, i) => ({
        ...item,
        localised: false,
        invite_pending: false,
        permission: note.permission,
        sorting_rank: item.default_sorting_rank || i,
        show_in_upcoming: undefined,
        notification_mins: undefined,
        relations: {}
      })).sort((a, b) => a.sorting_rank - b.sorting_rank) : [],
    [note]
    )

    return (
      <Native.View style={styles.listWrapper}>
        <List
          items={noteItems}
          itemStyleOptions={itemStyle}
        />
        <MultiTypeNewItem
          commonData={{
            note_id: note.id,
            default_sorting_rank: noteItems.length
          }}
          newRank={noteItems.length}
          whiteShadow={false}
        />
      </Native.View>
    )
  }

  return <></>
}

const styles = Native.StyleSheet.create({
  listWrapper: {
    marginVertical: 12,
    padding: 8,
    borderRadius: 10,
    flexDirection: 'column',
    backgroundColor: deepBlueOpacity(0.2),
    gap: 4,
    maxWidth: 500,
    alignSelf: 'center',
    flex: 1,
    width: '100%',
    marginBottom: 300
  },
  noteText: {
    borderWidth: 2,
    maxWidth: 800,
    width: '100%',
    alignSelf: 'center',
    marginVertical: 16,

    borderColor: deepBlue,
    backgroundColor: deepBlueOpacity(0.8),
    borderRadius: 10,
    fontSize: 16,
    height: 400,

    padding: 8,
    color: white
  }
})
