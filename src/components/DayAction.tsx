import { StyleSheet, View, Text, StyleSheetProperties } from 'react-native';

import { BouncyPressable } from '@/components/BouncyPressable';

type Props = {
  backgroundColor: string;
  color: string;
  containerStyle: object; // TODO LYF-648: Style this properly
  icon: JSX.Element;
  text: string;

  onPress: () => void;
}

export const DayAction = ({
  backgroundColor,
  color,
  containerStyle,
  text,
  icon,
  onPress
}: Props) => {
  const conditionalStyles = {
    wrapper: {
      backgroundColor,
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
  },
  content: {
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 4,
    height: 40,
  },
  title: {
    fontFamily: 'Lexend',
    fontSize: 18
  }
})
