import { useEffect, useState } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { TouchableHighlight } from 'react-native-gesture-handler';
import { Horizontal } from '../general/MiscComponents';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming
} from 'react-native-reanimated';
import Entypo from 'react-native-vector-icons/Entypo';
import { LyfElement } from 'utils/abstractTypes';

type Props = {
  name: string,
  children: LyfElement,
  icon: JSX.Element,
  startOpen?: boolean,
  bgColor?: string
}

export const SettingDropdown = ({
  name,
  children,
  icon,
  startOpen = false,
  bgColor
}: Props) => {
  const [open, setOpen] = useState(startOpen);
  const chevronAngle = useSharedValue(0);
  const rotationAnimation = useAnimatedStyle(() => ({
      transform: [{ 
        rotateZ: withTiming(`${chevronAngle.value}deg`, { duration: 200 })
      }]
    })
  );

  useEffect(() => {
    chevronAngle.value = open ? 90 : 0;
  }, [open]);

  return (
    <View style={[styles.main]}>
      <TouchableHighlight
        style={[
          styles.touchableHighlight,
          { backgroundColor: bgColor || 'white' }
        ]}
        underlayColor={'rgba(0,0,0,0.3)'}
        onPress={() => setOpen(!open)}
      >
        <View style={{ width: '100%' }}>
          <View style={[styles.pressableDropdown]}>
            <View style={{ width: 20 }}>{icon}</View>
            <Text style={[styles.titleText]}>{name}</Text>
            <Animated.View style={[styles.animatedChevron, rotationAnimation]}>
              <Entypo name={'chevron-right'} size={25} />
            </Animated.View>
          </View>
        </View>
      </TouchableHighlight>
      <Horizontal
        style={{
          borderWidth: 1,
          opacity: 0.2
        }}
      />

      {open && (
        <View>
          <View style={styles.dropdownContent}>{children}</View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  main: {
    flexDirection: 'column'
  },
  pressableDropdown: {
    flexDirection: 'row',
    gap: 10,
    paddingHorizontal: 2,
    flex: 1,
    alignItems: 'center'
  },
  touchableHighlight: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    height: 60
  },
  titleText: {
    fontSize: 22,
    fontFamily: 'InterMed',
    flexDirection: 'row',
    alignItems: 'center'
  },

  animatedChevron: {
    marginLeft: 'auto'
  },
  dropdownContent: {
    marginVertical: 8,
    paddingLeft: 4
  }
});
