import { inProgressColor } from "components/list/constants";
import { LinearGradient } from "expo-linear-gradient"
import { View, StyleSheet } from "react-native"
import { LyfElement } from "utils/abstractTypes";
import { eventsBadgeColor, sun } from "utils/colours"

type Props = {
  children: LyfElement;
  locations?: number[]
  sunRight?: boolean;
  accountForHeader?: boolean;
}

export const PageBackground = ({ children, locations, sunRight = false, accountForHeader = false }: Props) => {

const gradientColors = [eventsBadgeColor, inProgressColor, 'blue'];

const conditionalStyles = {
  main: {
    paddingHorizontal: accountForHeader ? 0 : 14,
    paddingTop: accountForHeader ? 0 : 15,
    flex: 1
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
        <View
          style={{
            position: 'absolute',
            backgroundColor: sun,
            width: 150,
            borderRadius: 100,
            height: 150,
            zIndex: 0,
            top: -75 + (accountForHeader ? 65 : 0),
            left: sunRight ? undefined : -75,
            right: sunRight ? -75 : undefined,
          }}
        />
        {children}
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  main: {
    minHeight: '100%',
    paddingBottom: 125,
    overflow: 'visible'
  }
})