import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import Popover from 'react-native-popover-view';

import { BouncyPressable, BouncyPressableOptions } from '@/components/BouncyPressable';
import { Horizontal } from '@/components/Horizontal';
import { blackWithOpacity } from '@/utils/colours';

export type LyfMenuProps = {
  children: JSX.Element; // The menu will display when this is pressed!
  pressableOptions?: BouncyPressableOptions;
  options: PopoverMenuOption[];
  textAlignment?: 'center' | 'auto' | 'left' | 'right' | 'justify' | undefined;
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
  pressableOptions = {},
  textAlignment = 'center',
  options,
  children
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
            onPress={showPopover}
            {...pressableOptions}
          >
            {children}
          </BouncyPressable>
        </View>
      )}>
      <View style={styles.optionsWrapper}>
        {options.map(({ text, onSelect }, i) => (
          <View key={text}>
            <TouchableOpacity onPress={onSelect} style={styles.optionWrapper}>
              <Text style={[styles.optionText, conditionalStyles.optionText]}>
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
  optionWrapper: { marginHorizontal: 8, marginVertical: 8 },
  optionsContainer: {
    borderColor: blackWithOpacity(0.5),
    borderRadius: 10,
    borderWidth: 0.5,
    flexDirection: 'column',
    paddingLeft: 0
  },
  optionsWrapper: { marginVertical: 4 }
});
