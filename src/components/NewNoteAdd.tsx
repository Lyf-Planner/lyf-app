import { useRef } from 'react';
import { StyleSheet, View } from 'react-native';

import {
  Menu,
  MenuOptions,
  MenuOption,
  MenuTrigger,
  renderers
} from 'react-native-popup-menu';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import { BouncyPressable } from '@/components/BouncyPressable';
import { Horizontal } from '@/components/Horizontal';
import { NoteType } from '@/schema/database/notes';
import { LyfElement } from '@/utils/abstractTypes';
import { black, blackWithOpacity, deepBlue, inProgressColor } from '@/utils/colours';

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

  const menu = useRef<Menu>(null);

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
            text="+ 🗒 Note"
            customStyles={optionStyles}
            onSelect={() => onOptionSelect(NoteType.NoteOnly)}
          />

          <Horizontal style={styles.optionSeperator} />

          <MenuOption
            value={1}
            text="+ 🖊️ List"
            customStyles={optionStyles}
            onSelect={() => onOptionSelect(NoteType.ListOnly)}
          />
        </MenuOptions>

        <MenuTrigger customStyles={{
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
  newNoteContainer: {
    backgroundColor: deepBlue,
    borderRadius: 5,
    padding: 4,

    shadowColor: black,
    shadowOffset: { width: 2, height: 2 },
    shadowRadius: 0.5
  },
  optionSeperator: { marginHorizontal: 5 },
  optionText: {
    fontFamily: 'Lexend',
    fontSize: 18,
    textAlign: 'center'
  },
  optionWrapper: {
    alignItems: 'center',
    flexDirection: 'row',
    margin: 8,
    width: 100
  },

  optionsContainer: {
    borderColor: blackWithOpacity(0.5),
    borderRadius: 10,
    borderWidth: 0.5,
    flexDirection: 'column',
    justifyContent: 'space-evenly',
    paddingLeft: 0
  }
});
