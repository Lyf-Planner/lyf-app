import { StyleSheet, View } from 'react-native';

import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

import { LyfMenu } from '@/containers/LyfMenu';
import { NoteType } from '@/schema/database/notes';
import { black, deepBlue, inProgressColor } from '@/utils/colours';

type Props = {
  newNote: (type: NoteType) => void;
}

export const NewNoteMenu = ({ newNote }: Props) => {
  const onOptionSelect = (type: NoteType) => {
    newNote(type);
    return false;
  };

  return (
    <View>
      <LyfMenu
        options={[ {
          icon: <MaterialIcons name='format-list-bulleted-add' size={24} />,
          text: 'List',
          onSelect: () => onOptionSelect(NoteType.ListOnly)
        }, {
          icon: <MaterialCommunityIcons name='note-plus' size={22} />,
          text: 'Note',
          onSelect: () => onOptionSelect(NoteType.NoteOnly)
        }, {
          icon: <MaterialCommunityIcons name='folder-plus' size={22} />,
          text: 'Folder',
          onSelect: () => onOptionSelect(NoteType.Folder)
        }]}
        textAlignment='left'
      >
        <NewNoteButton />
      </LyfMenu>
    </View>
  );
};

const NewNoteButton = () => {
  return (
    <View style={styles.newNoteContainer}>
      <MaterialCommunityIcons name="note-plus-outline" size={28} color={inProgressColor} />
    </View>
  );
};

const styles = StyleSheet.create({
  newNoteContainer: {
    backgroundColor: deepBlue,
    borderRadius: 10,
    padding: 6,

    shadowColor: black,
    shadowOffset: { width: 2, height: 2 },
    shadowRadius: 0.5
  }
});
