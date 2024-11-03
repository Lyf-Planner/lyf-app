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
    borderRadius: 30,
    aspectRatio: 1,
    width: '10%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center'
  }
});
