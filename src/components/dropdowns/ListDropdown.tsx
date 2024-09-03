import { useEffect, useState } from 'react';
import { Pressable, StyleSheet, View, Text, Platform } from 'react-native';
import { List } from '../list/List';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  FadeIn
} from 'react-native-reanimated';
import { deepBlue, deepBlueOpacity, eventsBadgeColor } from '../../utils/colours';
import { useTimetable } from 'providers/cloud/useTimetable';
import Entypo from 'react-native-vector-icons/Entypo';
import { ItemType } from 'schema/database/items';
import { LocalItem } from 'schema/items';
import { NewItem } from 'components/list/NewItem';

type Props = {
  items: LocalItem[],
  listType: ItemType,
  icon: JSX.Element,
  name: string,
  startOpen?: boolean
}

export const ListDropdown = ({ items, listType, icon, name, startOpen = false }: Props) => {
  const [hide, updateHide] = useState(!startOpen);
  const { addItem } = useTimetable();

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
          <Animated.View style={[styles.animatedChevron, chevronRotationAnimation]}>
            <Entypo name="chevron-right" color={eventsBadgeColor} size={25} />
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
  dropdownContainer: {
    flexDirection: 'column',
    borderRadius: 10,
    padding: 12,
    justifyContent: 'flex-start',
    borderWidth: 2,
    borderColor: 'rgba(0, 0, 0, 0.3)',

    backgroundColor: deepBlueOpacity(Platform.OS !== 'ios' ? 0.9 : 0.7),

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
  listSize: {
    paddingVertical: 4,
    fontSize: 16,
    marginLeft: 'auto',
    fontFamily: 'Lexend',
    color: eventsBadgeColor
  },
  animatedChevron: {
    marginRight: 5
  },
  listWrapper: {
    flexDirection: 'column',
    gap: 4,
    marginTop: 12,
  }
});
