import { useRef } from 'react';
import { StyleSheet } from 'react-native';

import {
  Menu,
  MenuOptions,
  MenuTrigger,
  renderers
} from 'react-native-popup-menu';

import { BouncyPressable, BouncyPressableProps } from '@/components/BouncyPressable';
import { LyfElement } from '@/utils/abstractTypes';
import { blackWithOpacity } from '@/utils/colours';

export type LyfMenuProps = {
  name: string;
  onClose?: () => void;
  onLongPress?: () => void;
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

// Equivalent to LyfMenu but contains a singular item
// This has it's own component as the use case is quite different
// The key distinction is the intent that a popup contains content and is not a menu option

export const LyfPopup = ({
  name,
  onClose,
  onLongPress,
  placement,
  popupContent,
  children
}: LyfMenuProps) => {
  const rendererProps = {
    placement,
    anchorStyle: { backgroundColor: '#bababa' }
  };

  const ref = useRef<Menu | null>(null)

  return (
    <Menu
      name={name}
      ref={ref}
      renderer={renderers.Popover}
      rendererProps={rendererProps}
      onClose={onClose}
      onBackdropPress={onClose}
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
          TriggerTouchableComponent: (props: Partial<BouncyPressableProps>) => (
            <BouncyPressable {...props} onLongPress={onLongPress}>
              {props.children}
            </BouncyPressable>
          )
        }}
      >
        {children}
      </MenuTrigger>
    </Menu>
  );
};

const styles = StyleSheet.create({
  optionsContainer: {
    borderColor: blackWithOpacity(0.5),
    borderRadius: 10,
    borderWidth: 0.5,
    flexDirection: 'column',
    paddingLeft: 0
  },
  optionsWrapper: { marginVertical: 4 }
});
