import { List } from 'components/list/List';
import { MultiTypeNewItem } from 'components/list/MultiTypeNewItem';
import { NewItem } from 'components/list/NewItem';
import { useNotes } from 'providers/cloud/useNotes';
import { useTimetable } from 'providers/cloud/useTimetable';
import { useEffect, useMemo, useRef, useState } from 'react';
import * as Native from 'react-native';
import { ItemDbObject, ItemType } from 'schema/database/items';
import { Permission } from 'schema/database/items_on_users';
import { NoteType } from "schema/database/notes"
import { LocalItem } from 'schema/items';
import { UserRelatedNote } from 'schema/user';
import debouncer from 'signature-debouncer';
import { eventsBadgeColor } from 'utils/colours';

type Props = {
  note: UserRelatedNote
}

const debounceSignature = "NoteContent"

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

  const conditionalStyles = {
    listWrapper: {
      backgroundColor: eventsBadgeColor
    }
  }

  const itemStyle = {
    itemColor: 'rgb(30 41 59)',
    itemTextColor: 'rgb(203 213 225)'
  }


  if (note.type === NoteType.NoteOnly) {
    return (
      <Native.TextInput
        multiline={true}
        value={content}
        style={styles.noteText}
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
        relations: {}
      })).sort((a, b) => a.sorting_rank - b.sorting_rank) : [],
      [note]
    )

    return (
      <Native.View style={[conditionalStyles.listWrapper, styles.listWrapper]}>
        <List
          items={noteItems}
          itemStyleOptions={itemStyle}
          fromNote
        />
        <MultiTypeNewItem 
          commonData={{
            note_id: note.id,
            default_sorting_rank: noteItems.length
          }}
          newRank={noteItems.length}
        />
      </Native.View>
    )
  }

  return <></>
}

const styles = Native.StyleSheet.create({
  listWrapper: {
    marginTop: 8,
    paddingHorizontal: 10,
    paddingVertical: 12,
    borderRadius: 10,
  },
  noteText: {
    borderWidth: 1,
    marginTop: 6,
    borderColor: 'rgba(0,0,0,0.3)',
    backgroundColor: 'rgba(0,0,0,0.07)',
    borderRadius: 5,
    fontSize: 16,
    height: 375,
    padding: 8,
    marginBottom: 8
  },
})