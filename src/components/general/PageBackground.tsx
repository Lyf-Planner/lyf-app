import { inProgressColor } from "components/item/constants";
import { LinearGradient } from "expo-linear-gradient"
import { View, StyleSheet, Platform } from "react-native"
import Entypo from "react-native-vector-icons/Entypo";
import { LyfElement } from "utils/abstractTypes";
import { eventsBadgeColor, sun, white } from "utils/colours"

type Props = {
  children: LyfElement;
  locations?: number[]
  sunRight?: boolean;
  noPadding?: boolean;
  bottomAdjustment?: boolean
}

export const PageBackground = ({ 
  children, 
  locations, 
  sunRight = false, 
  noPadding = false,
  bottomAdjustment = true
}: Props) => {
  const gradientColors = [eventsBadgeColor, inProgressColor, 'blue'];

  const conditionalStyles = {
    main: {
      paddingHorizontal: noPadding ? 0 : 14,
      paddingBottom: Platform.OS === 'ios' && bottomAdjustment ? 200 : 0,
    },
    sun: {
      top: -75,
      left: sunRight ? undefined : -75,
      right: sunRight ? -75 : undefined,
    },
    webCloud: {
      left: sunRight ? 75 : undefined,
      right: sunRight ? undefined : 75,
    }
  }

  return (
    <LinearGradient
        colors={gradientColors}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 1 }}
        locations={locations || [0,0.75,0.9]}
        style={[styles.main, conditionalStyles.main]}
      >
        <View style={[styles.sun, conditionalStyles.sun]} />
        {Platform.OS !== 'ios' &&
          <Entypo name="cloud" style={[styles.webCloud, conditionalStyles.webCloud]} size={100} color={white} />
        }
        {children}
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  main: {
    minHeight: '100%',
    overflow: 'visible',
    flex: 1,
  },
  sun: {
    position: 'absolute',
    backgroundColor: sun,
    width: 150,
    borderRadius: 100,
    height: 150,
    zIndex: 0,
  },
  webCloud: {
    position: 'absolute',
    top: 40,
  }
})