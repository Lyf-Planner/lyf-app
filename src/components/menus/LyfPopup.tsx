import { useRef } from 'react';
import { StyleSheet } from 'react-native';
import {
  Menu,
  MenuOption,
  MenuOptions,
  MenuTrigger,
  renderers
} from 'react-native-popup-menu';
import { BouncyPressable, BouncyPressableOptions } from '../pressables/BouncyPressable';
import { LyfElement } from 'utils/abstractTypes';
import { Text } from 'react-native';

export type LyfMenuProps = {
  name: string;
  placement: MenuPopoverPlacement;
  children: JSX.Element; // The menu will display when this is pressed!
  popupContent: LyfElement
};

export type PopoverMenuOption = {
  text: string;
  onSelect: () => void;
};

export enum MenuPopoverPlacement {
  Top = 'top',
  Right = 'right',
  Bottom = 'bottom',
  Left = 'left',
  Auto = 'auto',
}

export const LyfPopup = ({
  name,
  placement,
  popupContent,
  children
}: LyfMenuProps) => {
  const rendererProps = {
    placement: placement,
    anchorStyle: { backgroundColor: '#bababa' }
  };

  const ref = useRef<Menu | null>(null)

  return (
    <Menu
      name={name}
      ref={ref}
      renderer={renderers.Popover}
      rendererProps={rendererProps}
    >
      <MenuOptions
        customStyles={{
          optionsContainer: styles.optionsContainer,
          optionsWrapper: styles.optionsWrapper
        }}
      >
        {popupContent}
      </MenuOptions>
      <MenuTrigger
        customStyles={{
          TriggerTouchableComponent: BouncyPressable
        }}
      >
        {children}
      </MenuTrigger>
    </Menu>
  );
};

const styles = StyleSheet.create({
  optionsContainer: {
    flexDirection: 'column',
    paddingLeft: 0,
    borderRadius: 10,
    borderWidth: 0.5,
    borderColor: 'rgba(0,0,0,0.5)'
  },
  optionsWrapper: { marginVertical: 4 },
  optionWrapper: { marginVertical: 4, marginHorizontal: 8 },
  optionText: { fontSize: 18, color: 'rgba(0,0,0,0.7)', textAlign: 'right', fontFamily: 'Lexend' },
  optionSeperator: { marginHorizontal: 5 }
});
