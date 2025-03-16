import { StyleSheet, View, Text } from 'react-native';

import { BouncyPressable } from '@/components/BouncyPressable';

type Props = {
  backgroundColor: string;
  color: string;
  containerStyle?: object;
  icon: JSX.Element;
  text: string;

  onPress: () => void;
}

export const ListAction = ({
  backgroundColor,
  color,
  containerStyle,
  text,
  icon,
  onPress
}: Props) => {
  const conditionalStyles = {
    wrapper: {
      backgroundColor
    },
    title: {
      color
    }
  }

  return (
    <BouncyPressable
      style={[styles.wrapper, conditionalStyles.wrapper]}
      onPress={onPress}
      containerStyle={containerStyle}
    >
      <View style={styles.content}>
        {icon}
        <Text style={[styles.title, conditionalStyles.title]}>{text}</Text>
      </View>
    </BouncyPressable>
  )
}

const styles = StyleSheet.create({
  wrapper: {
    borderRadius: 10,
    margin: 1
  },
  content: {
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 4,
    height: 45
  },
  title: {
    fontFamily: 'Lexend',
    fontSize: 18
  }
})
