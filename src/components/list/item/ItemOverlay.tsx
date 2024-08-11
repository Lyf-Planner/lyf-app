import { View, StyleSheet } from 'react-native';
import { useMemo } from 'react';
import {
  getItemPrimaryColor,
  getItemSecondaryColor
} from '../constants';
import { Vertical } from '../../general/MiscComponents';
import { deepBlue } from '../../../utils/colours';
import Animated, {
  useAnimatedStyle,
  withTiming
} from 'react-native-reanimated';
import {
  ItemStyleOptions,
  ListItemAnimatedValues
} from './Item';
import { AnimatedCheck } from '../../general/AnimatedCheck';
import { ItemTitleFormatter } from '../../text/ItemTitleFormatter';
import { CollaborativeIcon } from '../../general/CollaborativeIcon';
import { ItemTimeFormatter } from 'components/text/ItemTimeFormatter';
import { ItemType } from 'schema/database/items';
import { LocalItem } from 'schema/items';

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
    transform: [
      {
        translateX: withTiming(animatedValues.offsetX.value, {
          duration: 250
        })
      }
    ],
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

        {item.collaborative && <CollaborativeIcon item={item} />}
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  listItem: {
    flexDirection: 'row',
    width: '100%',
    padding: 10,
    height: 55,
    borderWidth: 1,
    gap: 4,
    alignItems: 'center'
  },
  listItemTimeSection: {
    minWidth: '30%',
    flexDirection: 'row',
    height: '100%',
    alignItems: 'center',
    marginLeft: 'auto',
    justifyContent: 'flex-end'
  },
  diagLines: {
    borderColor: deepBlue,
    opacity: 0.2,
    marginLeft: 8,
    height: '150%',
    borderLeftWidth: 2,
    transform: [{ rotateZ: '-20deg' }]
  }
});
