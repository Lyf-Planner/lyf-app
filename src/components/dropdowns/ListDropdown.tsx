import { useEffect, useState } from 'react';
import { Pressable, StyleSheet, View, Text } from 'react-native';
import { List } from '../list/List';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  FadeIn
} from 'react-native-reanimated';
import { deepBlue, eventsBadgeColor } from '../../utils/colours';
import { useTimetable } from '../../providers/useTimetable';
import Entypo from 'react-native-vector-icons/Entypo';
import { ItemType } from 'schema/database/items';
import { LocalItem } from 'schema/items';

type Props = {
  items: LocalItem[],
  listType: ItemType,
  icon: JSX.Element,
  name: string
}

export const ListDropdown = ({ items, listType, icon, name }: Props) => {
  const [hide, updateHide] = useState(true);
  const { addItem } = useTimetable();

  const scale = useSharedValue(1);
  const chevronAngle = useSharedValue(0);

  const scaleAnimation = useAnimatedStyle(() => ({
    transform: [{
      scale: withTiming(scale.value, { duration: 200 })
    }]
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
        onPressIn={() => scale.value = 0.95}
        onPressOut={() => scale.value = 1}
        onPress={() => updateHide(!hide)}
      >
        {icon}
        <Text style={styles.listTitle}>{name}</Text>
        <Text>{`(${items.length})`}</Text>
        <View style={styles.headerLeft}>
          <Animated.View style={[styles.animatedChevron, chevronRotationAnimation]}>
            <Entypo name="chevron-right" size={25} />
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
              itemColor: deepBlue,
              itemTextColor: 'rgb(203 213 225)'
            }}
            addItemByTitle={(title) => addItem(listType, items.length, { title })}
            type={listType}
            listWrapperStyles={{ backgroundColor: eventsBadgeColor }}
          />
        </Animated.View>
      )}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  dropdownContainer: {
    flexDirection: 'column',
    backgroundColor: eventsBadgeColor,
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 10,
    justifyContent: 'flex-start',
    marginVertical: 1,
    borderWidth: 2,
    borderColor: 'rgba(0, 0, 0, 0.1)',
    shadowColor: 'black',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 3
  },
  dropdownTextContainer: {
    flexDirection: 'row',
    gap: 8,
    width: '100%',
    alignItems: 'center'
  },
  headerLeft: {
    flexDirection: 'row',
    marginLeft: 'auto',
    alignItems: 'center'
  },
  listTitle: {
    fontSize: 20,
    paddingVertical: 4,
    fontFamily: 'InterSemi'
  },
  animatedChevron: {
    marginRight: 5
  },
  listWrapper: {
    flexDirection: 'column'
  }
});
