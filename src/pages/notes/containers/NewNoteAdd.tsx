import { useRef } from 'react';
import { StyleSheet, View } from 'react-native';
import {
  Menu,
  MenuOptions,
  MenuOption,
  MenuTrigger,
  renderers
} from 'react-native-popup-menu';
import { Horizontal } from 'components/general/MiscComponents';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { NoteType } from 'schema/database/notes';
import { useNotes } from 'providers/cloud/useNotes';

type Props = {
  newNote: (type: NoteType) => void;
}

export const NewNoteMenu = ({ newNote }: Props) => {
  const onOptionSelect = (type: NoteType) => {
    newNote(type);
    return false;
  };

  const menu = useRef<any>();

  const optionsContainerStyles = { 
    optionsContainer: styles.optionsContainer 
  }
  const optionStyles = {
    optionWrapper: styles.optionWrapper,
    optionText: styles.optionText
  }

  return (
    <View>
      <Menu
        name="new-note-menu"
        ref={menu}
        renderer={renderers.Popover}
        rendererProps={{
          placement: 'bottom',
          anchorStyle: { backgroundColor: '#bababa' }
        }}
      >
        <MenuOptions customStyles={optionsContainerStyles}>
          <MenuOption
            value={1}
            text="+ New List"
            customStyles={optionStyles}
            onSelect={() => onOptionSelect(NoteType.ListOnly)}
          />

          <Horizontal style={styles.optionSeperator} />

          <MenuOption
            value={2}
            text="+ New Note"
            customStyles={optionStyles}
            onSelect={() => onOptionSelect(NoteType.NoteOnly)}
          />
        </MenuOptions>

        <MenuTrigger>
          <NewNoteButton />
        </MenuTrigger>
      </Menu>
    </View>
  );
};

const NewNoteButton = () => {
  return (
    <View style={styles.newNoteContainer}>
      <MaterialCommunityIcons name="note-plus-outline" size={30} />
    </View>
  );
};

const styles = StyleSheet.create({
  optionsContainer: {
    flexDirection: 'column',
    justifyContent: 'space-evenly',
    paddingLeft: 0,
    borderRadius: 10,
    borderWidth: 0.5,
    borderColor: 'rgba(0,0,0,0.5)'
  },
  optionWrapper: { marginVertical: 4, marginHorizontal: 8 },
  optionText: { fontSize: 18 },
  optionSeperator: { marginHorizontal: 5 },

  newNoteContainer: { padding: 4, borderRadius: 5 }
});
