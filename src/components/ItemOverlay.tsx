import { useMemo } from 'react';
import { View, StyleSheet } from 'react-native';

import Animated, {
  useAnimatedStyle,
  withTiming
} from 'react-native-reanimated';

import { AnimatedCheck } from '@/components/AnimatedCheck';
import { CollaborativeIcon } from '@/components/CollaborativeIcon';
import { ItemTimeFormatter } from '@/components/ItemTimeFormatter';
import { ItemTitleFormatter } from '@/components/ItemTitleFormatter';
import { Vertical } from '@/components/Vertical';
import {
  ItemStyleOptions,
  ListItemAnimatedValues
} from '@/containers/Item';
import { ItemType } from '@/schema/database/items';
import { LocalItem } from '@/schema/items';
import { deepBlue } from '@/utils/colours';
import {
  getItemPrimaryColor,
  getItemSecondaryColor
} from '@/utils/item';

type Props = {
  item: LocalItem;
  itemStyleOptions: ItemStyleOptions;
  animatedValues: ListItemAnimatedValues;
};

export const ListItemOverlay = ({
  item,
  itemStyleOptions,
  animatedValues
}: Props) => {
  // ANIMATIONS

  const flickAnimation = useAnimatedStyle(() => ({
    transform: [{
      translateX: withTiming(animatedValues.offsetX.value, {
        duration: 200
      })
    }],
    zIndex: 50
  }));

  // STYLING

  const primaryColor = useMemo(
    () => getItemPrimaryColor(item, itemStyleOptions.itemColor),
    [item, itemStyleOptions]
  );
  const secondaryColor = useMemo(
    () => getItemSecondaryColor(item, itemStyleOptions.itemTextColor),
    [item, itemStyleOptions]
  );

  const conditionalStyles = {
    listItem: {
      backgroundColor: primaryColor,
      borderRadius: item.type === ItemType.Event ? 5 : 15
    }
  };

  return (
    <Animated.View style={flickAnimation}>
      <View style={[styles.listItem, conditionalStyles.listItem]}>
        <AnimatedCheck
          item={item}
          checkScale={animatedValues.checkScale}
          checkRotation={animatedValues.checkRotation}
          color={secondaryColor}
        />

        <ItemTitleFormatter item={item} textColor={secondaryColor} />

        {item.time && (
          <View style={styles.listItemTimeSection}>
            <Vertical style={styles.diagLines} />
            <ItemTimeFormatter item={item} textColor={secondaryColor} />
          </View>
        )}

        {item.collaborative && <CollaborativeIcon entity={item} type='item' />}
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  diagLines: {
    borderColor: deepBlue,
    borderLeftWidth: 2,
    height: '150%',
    marginLeft: 8,
    opacity: 0.2,
    transform: [{ rotateZ: '-20deg' }]
  },
  listItem: {
    alignItems: 'center',
    borderWidth: 0.5,
    flexDirection: 'row',
    gap: 4,
    height: 55,
    padding: 10,
    width: '100%'
  },
  listItemTimeSection: {
    alignItems: 'center',
    flexDirection: 'row',
    height: '100%',
    justifyContent: 'flex-end',
    marginLeft: 'auto',
    minWidth: '30%'
  }
});
