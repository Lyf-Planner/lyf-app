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
import { useNotes } from 'hooks/cloud/useNotes';
import { deepBlue, white } from 'utils/colours';
import { LyfElement } from 'utils/abstractTypes';
import { BouncyPressable } from 'components/pressables/BouncyPressable';
import { inProgressColor } from 'components/item/constants';

type Props = {
  newNote: (type: NoteType) => void;
}

type MenuTriggerProps = { 
  children: LyfElement, 
  onPress: () => void
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
            text="🗒 New Note"
            customStyles={optionStyles}
            onSelect={() => onOptionSelect(NoteType.NoteOnly)}
          />

          <Horizontal style={styles.optionSeperator} />

          <MenuOption
            value={1}
            text="🖊️ New List"
            customStyles={optionStyles}
            onSelect={() => onOptionSelect(NoteType.ListOnly)}
          />
        </MenuOptions>

        <MenuTrigger  customStyles={{
          TriggerTouchableComponent: ({ children, onPress }: MenuTriggerProps) => (
            <BouncyPressable 
              onPress={onPress} 
            >
              {children}
            </BouncyPressable>
          )
        }}>
          <NewNoteButton />
        </MenuTrigger>
      </Menu>
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
  optionsContainer: {
    flexDirection: 'column',
    justifyContent: 'space-evenly',
    paddingLeft: 0,
    borderRadius: 10,
    borderWidth: 0.5,
    borderColor: 'rgba(0,0,0,0.5)'
  },
  optionWrapper: { 
    marginVertical: 4, 
    marginHorizontal: 4, 
    flexDirection: 'row',
    alignItems: 'center',
    width: 125 
  },
  optionText: { fontSize: 18, fontFamily: 'Lexend', fontWeight: '200' },
  optionSeperator: { marginHorizontal: 5 },

  newNoteContainer: { 
    padding: 4, 
    borderRadius: 5,
    backgroundColor: deepBlue,

    shadowColor: 'black',
    shadowOffset: { width: 2, height: 2}, 
    shadowRadius: 0.5 
  }
});
