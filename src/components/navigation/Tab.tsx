import { routes } from 'Routes';
import { useMemo } from 'react';
import * as Native from 'react-native';
import Octicons from 'react-native-vector-icons/Octicons';

import { black, gentleBlack, offWhite, primaryGreen, transparent, white } from 'utils/colours';

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
    if (isCentral) {
      return  isFocused ? 105 : 100;
    }
    
    return 85;
  }

  const conditionalStyles = Native.StyleSheet.create({
    pressable: {
      backgroundColor: isFocused ? primaryGreen : white,
      borderTopLeftRadius: isCentral ? 15 : 0,
      borderTopRightRadius: isCentral ? 15 : 0,
      height: tabHeight(),
      borderColor: gentleBlack,
      borderTopWidth: 0.5,
      borderLeftWidth: isCentral ? 0.5 : 0,
      borderRightWidth: isCentral ? 0.5 : 0,
      paddingLeft: index === 0 ? 10 : 0,
      paddingRight: index === Object.keys(routes).length -1 ? 10 : 0,
    },
    iconWrapper: {
      paddingTop: 10,
    }
  });

  return (
    <Native.View
      key={index}
      style={styles.main}
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
    </Native.View>
  );
};

const styles = Native.StyleSheet.create({
  main: {
    flex: 1,
    justifyContent: 'center',
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
    bottom: 25 
  },
  label: {
    position: 'relative',
    bottom: 30,
    fontSize: 11,
    fontFamily: 'Lexend'
  }
})