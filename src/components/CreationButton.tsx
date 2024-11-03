import { StyleSheet, Text, Platform } from 'react-native'

import { BouncyPressable } from 'components/BouncyPressable'
import { Loader } from 'components/Loader'
import { deepBlueOpacity, eventsBadgeColor, white } from 'utils/colours'

interface ShadowOffset {
  height: number,
  width: number
}

interface Props {
  loading: boolean;
  icon: JSX.Element;
  onPress: () => void;
  shadowOffset: ShadowOffset;
  title: string;
}

export const CreationButton = ({
  loading,
  icon,
  onPress,
  shadowOffset,
  title
}: Props) => {
  return (
    <BouncyPressable
      style={[styles.creationButton, { shadowOffset }]}
      useTouchableHighlight
      onPress={onPress}
    >
      <>
        {loading
          ? <Loader color={eventsBadgeColor} size={36} />
          : icon
        }
        <Text style={styles.typeText}>{title}</Text>
      </>
    </BouncyPressable>
  )
}

const styles = StyleSheet.create({
  creationButton: {
    alignItems: 'center',
    backgroundColor: deepBlueOpacity(Platform.OS !== 'ios' ? 0.9 : 0.7),
    borderRadius: 40,
    flexDirection: 'column',

    gap: 8,
    height: 125,
    justifyContent: 'center',
    shadowColor: black,

    shadowOpacity: 0.7,
    shadowRadius: 2,
    width: 125
  },
  typeText: {
    color: white,
    fontFamily: 'Lexend',
    fontSize: 16
  }
})
