import Animated, {
  withTiming,
  useAnimatedStyle
} from 'react-native-reanimated';
import { ItemStatus } from '../constants';
import { StyleSheet } from 'react-native';
import { useCallback } from 'react';
import { sleep } from '../../../utils/misc';
import {
  Directions,
  Gesture,
  GestureDetector
} from 'react-native-gesture-handler';
import { ListItem, LyfElement } from '../../../utils/abstractTypes';
import * as Haptics from 'expo-haptics';
import { LIST_ITEM_HEIGHT, ListItemAnimatedValues } from './Item';
import { RemoveItem, UpdateItem } from '../../../providers/useTimetable';

type Props = {
  children: LyfElement;
  item: ListItem;
  invited: boolean; // Should be deprecated
  animatedValues: ListItemAnimatedValues;
  openModal: () => void;
  updateItem: UpdateItem;
  removeItem: RemoveItem;
};

export const SCALE_MS = 180;

export const ListItemGestureWrapper = ({
  children,
  item,
  invited,
  animatedValues,
  openModal,
  updateItem,
  removeItem
}: Props) => {
  let longPressTimer: NodeJS.Timeout | undefined;

  // GESTURE DEFINITIONS

  const tap = Gesture.Tap()
    .runOnJS(true)
    .onStart(() => handleTapIn())
    .onEnd(() => handleTapOut());
  const longPress = Gesture.LongPress()
    .runOnJS(true)
    .onStart(() => handleLongPressIn())
    .onEnd(() => handleLongPressOut());
  const flingLeft = Gesture.Fling()
    .direction(Directions.LEFT)
    .runOnJS(true)
    .onEnd(() => handleFlingLeft());
  const flingRight = Gesture.Fling()
    .direction(Directions.RIGHT)
    .runOnJS(true)
    .onEnd(() => handleFlingRight());

  const gestures = Gesture.Race(tap, longPress, flingLeft, flingRight);

  // GESTURE HANDLERS

  const handleTapIn = useCallback(async () => {
    if (invited) {
      return;
    }

    const markingAsDone = item.status !== ItemStatus.Done;
    animatedValues.scale.value = markingAsDone ? 0.7 : 0.9;
    await sleep(SCALE_MS);

    animatedValues.scale.value = markingAsDone ? 1.1 : 1;
    await sleep(SCALE_MS);
    markingAsDone && Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);

    animatedValues.scale.value = 1;
    animatedValues.checkScale.value = markingAsDone ? 1.5 : 1;
    await sleep(SCALE_MS);

    animatedValues.checkScale.value = 1;
  }, [item.status]);

  const handleTapOut = () => {
    if (invited) {
      openModal();
      return;
    }

    if (item.status === ItemStatus.Done) {
      updateItem(item.id, { status: ItemStatus.Upcoming });
    } else {
      updateItem(item.id, { status: ItemStatus.Done });
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    }
  };

  const handleLongPressIn = () => {
    if (invited) {
      return;
    }
    // Start animating the shrinking of the item while user holds it down

    animatedValues.scale.value = 0.75;

    // After the n seconds pressing, remove the item
    longPressTimer = setInterval(() => {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
      removeItem(item, true);
      clearTimeout(longPressTimer);
    }, 250);
  };

  const handleLongPressOut = () => {
    if (invited) {
      openModal();
      return;
    }
    clearTimeout(longPressTimer);
    animatedValues.scale.value = 1;
  };

  const handleFlingLeft = () => {
    animatedValues.offsetX.value = -40;

    openModal();
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

    // This makes the animation appear to pause for a second when slid back
    var closeAnimation = setInterval(() => {
      animatedValues.offsetX.value = 0;
      clearTimeout(closeAnimation);
    }, 500);
  };

  const handleFlingRight = () => {
    if (invited) {
      openModal();
      return;
    }
    animatedValues.offsetX.value = 40;

    updateItem(item.id, { status: ItemStatus.InProgress });
    item.status !== ItemStatus.InProgress &&
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    // This makes the animation appear to pause for a second when slid back
    var closeAnimation = setInterval(() => {
      animatedValues.offsetX.value = 0;
      clearTimeout(closeAnimation);
    }, 500);
  };

  const scaleAnimation = useAnimatedStyle(() => {
    return {
      transform: [
        {
          scale: withTiming(animatedValues.scale.value, {
            duration: SCALE_MS
          })
        }
      ]
    };
  });

  const conditionalStyles = {
    listItemWrapper: {
      // Dim the opacity if a task is cancelled or a user is only invited
      opacity: item.status === ItemStatus.Cancelled || invited ? 0.7 : 1
    }
  };

  return (
    <GestureDetector gesture={gestures}>
      <Animated.View
        style={[
          scaleAnimation,
          styles.listItemWrapper,
          conditionalStyles.listItemWrapper
        ]}
      >
        {children}
      </Animated.View>
    </GestureDetector>
  );
};

const styles = StyleSheet.create({
  listItemWrapper: {
    width: '100%',
    height: 55
  }
});
