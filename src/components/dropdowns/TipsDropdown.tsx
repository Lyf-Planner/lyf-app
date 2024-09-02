import { useEffect, useState } from 'react';
import { Pressable, StyleSheet, View, Text, Platform } from 'react-native';
import { List } from '../list/List';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  FadeIn
} from 'react-native-reanimated';
import { deepBlue, deepBlueOpacity, eventsBadgeColor, primaryGreen, white } from '../../utils/colours';
import { useTimetable } from 'providers/cloud/useTimetable';
import Entypo from 'react-native-vector-icons/Entypo';
import { BouncyPressable } from 'components/pressables/BouncyPressable';

type Props = {
  tips: string[],
  icon: JSX.Element,
  name: string,
  navigate: () => void,
  startOpen?: boolean
}

export const TipsDropdown = ({ 
  tips, 
  icon, 
  name, 
  navigate,
  startOpen = false 
}: Props) => {
  const [hide, updateHide] = useState(!startOpen);

  const scale = useSharedValue(1);
  const chevronAngle = useSharedValue(0);
  const shadowOffsetX = useSharedValue(2);
  const shadowOffsetY = useSharedValue(2);

  const scaleAnimation = useAnimatedStyle(() => ({
    transform: [{
      scale: withTiming(scale.value, { duration: 200 })
    }],
    shadowOffset: { 
      width: withTiming(shadowOffsetX.value, { duration: 100 }), 
      height: withTiming(shadowOffsetY.value, { duration: 100 })
    }
  }));
  const chevronRotationAnimation = useAnimatedStyle(() => ({
    transform: [{
      rotateZ: withTiming(`${chevronAngle.value}deg`, { duration: 200 })
    }]
  }));

  useEffect(() => {
    chevronAngle.value = hide ? 0 : 90;
  }, [hide]);

  return (
    <Animated.View style={[styles.dropdownContainer, scaleAnimation]}>
      <Pressable
        style={styles.dropdownTextContainer}
        onPressIn={() => {
          shadowOffsetX.value = 0;
          shadowOffsetY.value = 0;
          scale.value = 0.95;
        }}
        onPressOut={() => {
          shadowOffsetX.value = 2;
          shadowOffsetY.value = 2;
          scale.value = 1;
        }}
        onPress={() => updateHide(!hide)}
      >
        {icon}
        <Text style={styles.listTitle}>{name}</Text>
        <View style={styles.headerLeft}>
          <Animated.View style={[styles.animatedChevron, chevronRotationAnimation]}>
            <Entypo name="chevron-right" color={eventsBadgeColor} size={25} />
          </Animated.View>
        </View>
      </Pressable>
      
      {!hide && (
        <View>
          <Animated.View
            style={styles.tipsWrapper}
            entering={FadeIn.duration(200)}
          >
            {tips.map((x) => (
              <View style={styles.tipWrapper} key={x}>
                <Text style={styles.tip}>{x}</Text>
              </View>
            ))}
          </Animated.View>
          <BouncyPressable 
            onPress={() => navigate()}
            containerStyle={styles.navigateButton}
            withShadow
          >
            <Text style={styles.navigateText}>Take Me There</Text>
          </BouncyPressable>
        </View>
      )}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  dropdownContainer: {
    flexDirection: 'column',
    borderRadius: 10,
    padding: 12,
    justifyContent: 'flex-start',
    borderWidth: 2,
    borderColor: 'rgba(0, 0, 0, 0.3)',

    backgroundColor: deepBlueOpacity(Platform.OS !== 'ios' ? 0.9 : 0.8),

    shadowColor: 'black',
    shadowOpacity: 0.75,
    shadowRadius: 2
  },
  dropdownTextContainer: {
    flexDirection: 'row',
    gap: 8,
    width: '100%',
    alignItems: 'center'
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  listTitle: {
    fontSize: 20,
    paddingVertical: 2,
    fontFamily: 'Lexend',
    color: eventsBadgeColor
  },
  animatedChevron: {
    marginRight: 5
  },
  tipsWrapper: {
    flexDirection: 'column',
    gap: 12,
    marginVertical: 10,
  },

  tipWrapper: {
    flexDirection: 'row',
    width: '100%',
    paddingHorizontal: 8,
  },
  bullet: {
    width: '5%',
    color: 'white',
    fontSize: 20
  },
  tip: {
    fontFamily: 'Lexend',
    fontSize: 16,
    color: 'white'
  },

  navigateButton: {
    backgroundColor: primaryGreen,
    borderRadius: 10,
    marginVertical: 8,
    padding: 10,
    flexDirection: 'row',
    justifyContent: 'center'
  },
  navigateText: {
    fontFamily: 'Lexend',
    fontSize: 16,
    color: white
  }
});
