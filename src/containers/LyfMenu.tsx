import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import Popover from 'react-native-popover-view';

import { BouncyPressable, BouncyPressableOptions } from '@/components/BouncyPressable';
import { Horizontal } from '@/components/Horizontal';
import { blackWithOpacity } from '@/utils/colours';

export type LyfMenuProps = {
  children: JSX.Element; // The menu will display when this is pressed!
  disabled?: boolean;
  onPress?: () => void; // used as a default fallback for pressing if useLongPress is provided
  options: PopoverMenuOption[];
  pressableOptions?: BouncyPressableOptions;
  textAlignment?: 'center' | 'auto' | 'left' | 'right' | 'justify' | undefined;
  useLongPress?: boolean;
  useHold?: boolean;
};

export type PopoverMenuOption = {
  icon?: JSX.Element;
  text: string;
  onSelect: () => void;
  style?: object;
};

export enum MenuPopoverPlacement {
  Top = 'top',
  Right = 'right',
  Bottom = 'bottom',
  Left = 'left',
  Auto = 'auto',
}

export const LyfMenu = ({
  children,
  disabled = false,
  onPress = () => null,
  options,
  pressableOptions = {},
  textAlignment = 'center',
  useLongPress = false,
  useHold = false
}: LyfMenuProps) => {
  const conditionalStyles = {
    optionText: {
      textAlign: textAlignment
    }
  };

  return (
    <Popover
      popoverStyle={styles.optionsContainer}
      from={(_sourceRef, showPopover) => (
        <View>
          <BouncyPressable
            disabled={disabled}
            onPress={!useLongPress && !useHold ? showPopover : onPress} // TODO improve this hard to read logic
            onLongPress={useLongPress && !useHold ? showPopover : undefined}
            onPressIn={useHold ? onPress : undefined}
            longPressDuration={150}
            {...pressableOptions}
          >
            {children}
          </BouncyPressable>
        </View>
      )}>
      <View style={styles.optionsWrapper}>
        {options.map(({ icon, text, onSelect, style }, i) => (
          <View key={text} style={style}>
            <TouchableOpacity onPress={onSelect} style={styles.optionWrapper}>
              {icon}
              <Text numberOfLines={1} style={[styles.optionText, conditionalStyles.optionText]}>
                {text}
              </Text>
            </TouchableOpacity>
            {i !== (options.length - 1) && <Horizontal />}
          </View>
        ))}
      </View>
    </Popover>
  );
};

const styles = StyleSheet.create({
  optionText: { color: blackWithOpacity(0.7), fontFamily: 'Lexend', fontSize: 18 },
  optionWrapper: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 4,
    justifyContent: 'space-evenly',
    marginHorizontal: 8,
    marginVertical: 8
  },
  optionsContainer: {
    borderColor: blackWithOpacity(0.5),
    borderRadius: 10,
    borderWidth: 0.5,
    flexDirection: 'column',
    paddingLeft: 0
  },
  optionsWrapper: { marginVertical: 4 }
});
