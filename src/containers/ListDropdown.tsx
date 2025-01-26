import { useEffect, useState } from 'react';
import { Pressable, StyleSheet, View, Text, Platform } from 'react-native';

import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  FadeIn
} from 'react-native-reanimated';
import Entypo from 'react-native-vector-icons/Entypo';

import { List } from '@/containers/List';
import { ItemType } from '@/schema/database/items';
import { LocalItem } from '@/schema/items';
import { black, blackWithOpacity, deepBlue, deepBlueOpacity, eventsBadgeColor } from '@/utils/colours';

type Props = {
  items: LocalItem[],
  icon: JSX.Element,
  name: string,
  startOpen?: boolean,
  type: ItemType,
}

export const ListDropdown = ({ items, icon, name, startOpen = false, type }: Props) => {
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
        style={styles.dropdownPressable}
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
          {items.length > 0 &&
            <Text style={styles.listSize}>{`(${items.length})`}</Text>
          }
          <Animated.View style={[styles.animatedChevron, chevronRotationAnimation]}>
            <Entypo name="chevron-right" color={eventsBadgeColor} size={30} />
          </Animated.View>
        </View>
      </Pressable>

      {!hide && (
        <Animated.View
          style={styles.listWrapper}
          entering={FadeIn.duration(200)}
        >
          <List
            fixedType={type}
            items={items}
            itemStyleOptions={{
              itemColor: eventsBadgeColor,
              itemTextColor: deepBlue
            }}
            newItemContext={{ /* none required */ }}
          />
        </Animated.View>
      )}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  animatedChevron: {
    marginRight: 5
  },
  dropdownContainer: {
    backgroundColor: deepBlueOpacity(Platform.OS !== 'ios' ? 0.9 : 0.7),
    borderColor: blackWithOpacity(0.3),
    borderRadius: 10,
    borderWidth: 1,
    flexDirection: 'column',
    justifyContent: 'flex-start',
    padding: 12,

    shadowColor: black,
    shadowOpacity: 0.5,
    shadowRadius: 1
  },
  dropdownPressable: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 8,
    width: '100%'
  },
  headerLeft: {
    alignItems: 'center',
    flexDirection: 'row',
    marginLeft: 'auto'
  },
  listSize: {
    color: eventsBadgeColor,
    fontFamily: 'Lexend',
    fontSize: 16,
    marginLeft: 'auto',
    paddingVertical: 4
  },
  listTitle: {
    color: eventsBadgeColor,
    fontFamily: 'Lexend',
    fontSize: 20,
    paddingVertical: 2
  },
  listWrapper: {
    flexDirection: 'column',
    gap: 4,
    marginTop: 12
  }
});
