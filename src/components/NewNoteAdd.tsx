import { StyleSheet, View } from 'react-native';

import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

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
        options={[{
          text: '+ 🗒 Note',
          onSelect: () => onOptionSelect(NoteType.NoteOnly)
        }, {
          text: '+ 🖊️ List',
          onSelect: () => onOptionSelect(NoteType.ListOnly)
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
    borderRadius: 5,
    padding: 4,

    shadowColor: black,
    shadowOffset: { width: 2, height: 2 },
    shadowRadius: 0.5
  }
});
