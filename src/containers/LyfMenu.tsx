import { useRef } from 'react';
import { StyleSheet } from 'react-native';
import {
  Menu,
  MenuOption,
  MenuOptions,
  MenuTrigger,
  renderers
} from 'react-native-popup-menu';
import { BouncyPressable, BouncyPressableOptions } from 'components/BouncyPressable';
import { LyfElement } from 'utils/abstractTypes';

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
