import { useEffect, useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { TouchableHighlight } from 'react-native-gesture-handler';
import { Horizontal } from '../general/MiscComponents';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming
} from 'react-native-reanimated';
import Entypo from 'react-native-vector-icons/Entypo';
import { LyfElement } from 'utils/abstractTypes';
import { deepBlueOpacity, eventsBadgeColor, primaryGreen, white } from 'utils/colours';

type Props = {
  name: string,
  children: LyfElement,
  icon: JSX.Element,
  startOpen?: boolean,
  bgColor?: string,
  textColor?: string
}

export const SettingDropdown = ({
  name,
  children,
  icon,
  startOpen = false,
  bgColor,
  textColor
}: Props) => {
  const [open, setOpen] = useState(startOpen);
  const chevronAngle = useSharedValue(0);
  const rotationAnimation = useAnimatedStyle(() => ({
    transform: [{ 
      rotateZ: withTiming(`${chevronAngle.value}deg`, { duration: 200 })
    }]
  }));

  useEffect(() => {
    chevronAngle.value = open ? 90 : 0;
  }, [open]);

  return (
    <View style={[styles.main]}>
      <TouchableOpacity
        style={[
          styles.touchableHighlight,
          { backgroundColor: bgColor || 'white' }
        ]}
        onPress={() => setOpen(!open)}
        activeOpacity={0.5}
      >
        <View style={{ width: '100%' }}>
          <View style={[styles.pressableDropdown]}>
            <View style={{ width: 20 }}>{icon}</View>
            <Text style={[styles.titleText, { color: textColor }]}>{name}</Text>
            <Animated.View style={[styles.animatedChevron, rotationAnimation]}>
              <Entypo name={'chevron-right'} size={25} color={textColor} />
            </Animated.View>
          </View>
        </View>
      </TouchableOpacity>
      

      {open && (
        <View style={styles.dropdownContent}>{children}</View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  main: {
    flexDirection: 'column',
  },
  pressableDropdown: {
    flexDirection: 'row',
    gap: 10,
    paddingHorizontal: 16,
    flex: 1,
    alignItems: 'center',
  },
  touchableHighlight: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 60,

    shadowColor: 'black',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 2
  },
  titleText: {
    fontSize: 20,
    fontFamily: 'Lexend',
    flexDirection: 'row',
    alignItems: 'center'
  },

  animatedChevron: {
    marginLeft: 'auto'
  },
  dropdownContent: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: deepBlueOpacity(0.7)
  }
});
