import { Pressable, StyleSheet } from 'react-native';

import Feather from 'react-native-vector-icons/Feather';

type Props = {
  disabled: boolean;
  backgroundColor: string;
  iconColor: string;
};

export const SortingHandle = ({
  disabled,
  backgroundColor,
  iconColor
}: Props) => {
  const conditionalStyles = {
    sortableIndicator: {
      backgroundColor
    }
  };

  return (
    <Pressable
      disabled={disabled}
      style={[styles.sortableIndicator, conditionalStyles.sortableIndicator]}
    >
      <Feather name="menu" size={16} color={iconColor} />
    </Pressable>
  );
};

const styles = StyleSheet.create({
  sortableIndicator: {
    alignItems: 'center',
    aspectRatio: 1,
    borderRadius: 30,
    flexDirection: 'row',
    justifyContent: 'center',
    width: '10%'
  }
});
