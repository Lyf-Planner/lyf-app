import { useRef } from 'react';
import { StyleSheet } from 'react-native';

import {
  Menu,
  MenuOption,
  MenuOptions,
  MenuTrigger,
  renderers
} from 'react-native-popup-menu';

import { BouncyPressable, BouncyPressableOptions } from '@/components/BouncyPressable';
import { LyfElement } from '@/utils/abstractTypes';
import { blackWithOpacity } from '@/utils/colours';

export type LyfMenuProps = {
  name: string;
  placement: MenuPopoverPlacement;
  children: JSX.Element; // The menu will display when this is pressed!
  pressableOptions?: BouncyPressableOptions
  options: PopoverMenuOption[];
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

export const LyfMenu = ({
  name,
  placement,
  options,
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
    >
      <MenuOptions
        customStyles={{
          optionsContainer: styles.optionsContainer,
          optionsWrapper: styles.optionsWrapper
        }}
      >
        {options.map((option, i) => (
          <MenuOption
            value={i}
            key={i}
            text={option.text}
            customStyles={{
              optionWrapper: styles.optionWrapper,
              optionText: styles.optionText
            }}
            onSelect={option.onSelect}
          />
        ))}
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
  optionText: { color: blackWithOpacity(0.7), fontFamily: 'Lexend', fontSize: 18, textAlign: 'right' },
  optionWrapper: { marginHorizontal: 8, marginVertical: 4 },
  optionsContainer: {
    borderColor: blackWithOpacity(0.5),
    borderRadius: 10,
    borderWidth: 0.5,
    flexDirection: 'column',
    paddingLeft: 0
  },
  optionsWrapper: { marginVertical: 4 }
});
