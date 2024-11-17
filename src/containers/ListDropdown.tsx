import { useEffect, useState } from 'react';
import { Pressable, StyleSheet, View, Text, Platform } from 'react-native';

import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  FadeIn
} from 'react-native-reanimated';
import Entypo from 'react-native-vector-icons/Entypo';

import { NewItem } from '@/components/NewItem';
import { List } from '@/containers/List';
import { ItemType } from '@/schema/database/items';
import { LocalItem } from '@/schema/items';
import { useTimetableStore } from '@/store/useTimetableStore';
import { black, blackWithOpacity, deepBlue, deepBlueOpacity, eventsBadgeColor } from '@/utils/colours';

type Props = {
  items: LocalItem[],
  listType: ItemType,
  icon: JSX.Element,
  name: string,
  startOpen?: boolean
}

export const ListDropdown = ({ items, listType, icon, name, startOpen = false }: Props) => {
  const [hide, updateHide] = useState(!startOpen);
  const { addItem } = useTimetableStore();

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
        {items.length > 0 &&
          <Text style={styles.listSize}>{`(${items.length})`}</Text>
        }
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
            items={items}
            itemStyleOptions={{
              itemColor: eventsBadgeColor,
              itemTextColor: deepBlue
            }}
          />
          <NewItem
            addItemByTitle={(title: string) => addItem(
              listType,
              items.length,
              { title }
            )}
            type={listType}
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
    borderWidth: 2,
    flexDirection: 'column',
    justifyContent: 'flex-start',

    padding: 12,

    shadowColor: black,
    shadowOpacity: 0.75,
    shadowRadius: 2
  },
  dropdownTextContainer: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 8,
    width: '100%'
  },
  headerLeft: {
    alignItems: 'center',
    flexDirection: 'row'
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
