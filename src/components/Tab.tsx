import { useMemo } from 'react';
import * as Native from 'react-native';

import { LinearGradient } from 'expo-linear-gradient';
import Octicons from 'react-native-vector-icons/Octicons';

import { routes } from '@/Routes';
import { black, gentleBlack, primaryGreen, secondaryGreen, white } from '@/utils/colours';

const ENLARGED_TAB_INDEX = 2

type Props = {
  isFocused: boolean;
  index: number;
  onPress: () => void;
  route: typeof routes[keyof typeof routes];
}

export const Tab = ({ isFocused, index, onPress, route }: Props) => {
  const isCentral = useMemo(() => index === ENLARGED_TAB_INDEX, [index]);

  const tabHeight = () => {
    let height = 80;
    if (isCentral) {
      height = 90
    }

    if (Native.Platform.OS !== 'ios') {
      height -= 10;
    }

    return height;
  }

  const gradientStart = { x: 0, y: 1 };
  const gradientEnd = { x: 0, y: 0 };
  const gradientColors = isFocused ? [secondaryGreen, primaryGreen, primaryGreen] : [white, white]

  const conditionalStyles = Native.StyleSheet.create({
    linearGradient: {
      borderTopLeftRadius: isCentral ? 15 : 0,
      borderTopRightRadius: isCentral ? 15 : 0,
      height: tabHeight()
    },
    pressable: {
      borderTopLeftRadius: isCentral ? 15 : 0,
      borderTopRightRadius: isCentral ? 15 : 0,
      height: tabHeight(),
      borderColor: gentleBlack,
      borderLeftWidth: isCentral ? 0.5 : 0,
      borderRightWidth: isCentral ? 0.5 : 0,
      borderTopWidth: isFocused ? 0 : 0.5,
      paddingLeft: index === 0 ? 10 : 0,
      paddingRight: index === Object.keys(routes).length - 1 ? 10 : 0
    },
    iconWrapper: {
      paddingTop: 10
    }
  });

  return (
    <Native.View
      key={index}
      style={styles.main}
    >
      <LinearGradient
        colors={gradientColors}
        start={gradientStart}
        end={gradientEnd}
        style={conditionalStyles.linearGradient}
      >
        <Native.Pressable
          onPress={onPress}
          style={[styles.pressable, conditionalStyles.pressable]}
        >

          <Native.View
            style={[styles.iconWrapper, conditionalStyles.iconWrapper]}
          >
            {route.icon(isFocused ? white : black)}
          </Native.View>
          {isFocused &&
          <Octicons
            name="dot-fill"
            color="white"
            style={styles.whiteDot}
          />
          }
        </Native.Pressable>
      </LinearGradient>
    </Native.View>
  );
};

const styles = Native.StyleSheet.create({
  main: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'flex-end',
    borderRadius: 1
  },
  pressable: {
    marginTop: 'auto',
    alignItems: 'center',
    borderTopColor: gentleBlack
  },
  iconWrapper: {
    flex: 1,
    alignItems: 'center',
    height: 60,
    width: 60
  },
  whiteDot: {
    position: 'relative',
    bottom: Native.Platform.OS !== 'ios' ? 15 : 25
  }
})
