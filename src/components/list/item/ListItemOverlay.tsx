import { View, StyleSheet } from 'react-native';
import { useMemo } from 'react';
import {
  ListItemType,
  getItemPrimaryColor,
  getItemSecondaryColor
} from '../constants';
import { Vertical } from '../../general/MiscComponents';
import { deepBlue } from '../../../utils/constants';
import Animated, {
  useAnimatedStyle,
  withTiming
} from 'react-native-reanimated';
import {
  ItemStyleOptions,
  LIST_ITEM_HEIGHT,
  ListItemAnimatedValues
} from './ListItem';
import { ListItem } from '../../../utils/abstractTypes';
import { AnimatedCheck } from '../../general/AnimatedCheck';
import { ItemTitleFormatter } from '../../text/ItemTitleFormatter';
import { CollaborativeIcon } from '../../general/CollaborativeIcon';
import { ItemTimeFormatter } from 'components/text/ItemTimeFormatter';

type Props = {
  item: ListItem;
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
  const isCollaborative = useMemo(
    () => item.permitted_users.length > 1 || item.invited_users?.length > 0,
    [item]
  );
  const showTime = useMemo(() => !!item.time, [item]);

  const conditionalStyles = {
    listItem: {
      backgroundColor: primaryColor,
      borderRadius: item.type !== ListItemType.Task ? 5 : 15
    }
  };

  return (
    <Animated.View style={flickAnimation}>
      <View style={[styles.listItem, conditionalStyles.listItem]}>
        <AnimatedCheck
          item={item}
          checkScale={animatedValues.checkScale}
          color={secondaryColor}
        />

        <ItemTitleFormatter item={item} textColor={secondaryColor} />

        {showTime && (
          <View style={styles.listItemTimeSection}>
            <Vertical style={styles.diagLines} />
            <ItemTimeFormatter item={item} textColor={secondaryColor} />
          </View>
        )}

        {isCollaborative && <CollaborativeIcon item={item} />}
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
    height: '200%',
    borderLeftWidth: 2,
    transform: [{ rotateZ: '-20deg' }]
  }
});
