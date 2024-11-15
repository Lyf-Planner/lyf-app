import { useEffect, useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';

import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming
} from 'react-native-reanimated';
import Entypo from 'react-native-vector-icons/Entypo';

import { LyfElement } from '@/utils/abstractTypes';
import { black, deepBlueOpacity } from '@/utils/colours';

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
    <View style={styles.main}>
      <TouchableOpacity
        style={[
          styles.touchableHighlight,
          { backgroundColor: bgColor || 'white' }
        ]}
        onPress={() => setOpen(!open)}
        activeOpacity={0.5}
      >
        <View style={styles.pressableDropdown}>
          <View style={styles.icon}>{icon}</View>
          <Text style={[styles.titleText, { color: textColor }]}>{name}</Text>
          <Animated.View style={[styles.animatedChevron, rotationAnimation]}>
            <Entypo name={'chevron-right'} size={25} color={textColor} />
          </Animated.View>
        </View>
      </TouchableOpacity>

      {open && (
        <View style={styles.dropdownContent}>{children}</View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  animatedChevron: {
    marginLeft: 'auto'
  },
  dropdownContent: {
    backgroundColor: deepBlueOpacity(0.7),
    paddingHorizontal: 12,
    paddingVertical: 8
  },
  icon: { width: 20 },
  main: {
    flexDirection: 'column'
  },
  pressableDropdown: {
    alignItems: 'center',
    flexDirection: 'row',
    flex: 1,
    gap: 10,
    paddingHorizontal: 16,
    width: '100%'
  },

  titleText: {
    alignItems: 'center',
    flexDirection: 'row',
    fontFamily: 'Lexend',
    fontSize: 20
  },
  touchableHighlight: {
    alignItems: 'center',
    flexDirection: 'row',
    height: 60,

    shadowColor: black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 2
  }
});
