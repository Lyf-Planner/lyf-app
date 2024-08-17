import { Loader } from "components/general/MiscComponents"
import { BouncyPressable } from "components/pressables/BouncyPressable"
import { StyleSheet, Text } from "react-native"
import Entypo from "react-native-vector-icons/Entypo"
import { deepBlueOpacity, eventsBadgeColor, white } from "utils/colours"

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
  title,
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
    backgroundColor: deepBlueOpacity(0.7),
    borderRadius: 40,
    height: 125,
    width: 125,

    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,

    shadowColor: 'black',
    shadowOpacity: 0.7,
    shadowRadius: 2
  },
  typeText: {
    fontFamily: 'Lexend',
    color: white,
    fontSize: 16
  }
})