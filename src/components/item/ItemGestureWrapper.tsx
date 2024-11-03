import Animated, {
  withTiming,
  useAnimatedStyle
} from 'react-native-reanimated';
import { ItemStatus } from '../item/constants';
import { Platform, StyleSheet, View } from 'react-native';
import { SyntheticEvent, useCallback, useEffect, useRef, useState } from 'react';
import { sleep } from '../../utils/misc';
import {
  Directions,
  Gesture,
  GestureDetector
} from 'react-native-gesture-handler';
import { LyfElement } from '../../utils/abstractTypes';
import * as Haptics from 'expo-haptics';
import { ListItemAnimatedValues } from './Item';
import { RemoveItem, UpdateItem, useTimetable } from 'hooks/cloud/useTimetable';
import { LocalItem } from 'schema/items';

type Props = {
  children: LyfElement;
  item: LocalItem;
  invited: boolean; // Should be deprecated
  animatedValues: ListItemAnimatedValues;
  openModal: () => void;
  setCreatingLocalised: (creating: boolean) => void;
};

export const SCALE_MS = 180;

export const ListItemGestureWrapper = ({
  children,
  item,
  invited,
  animatedValues,
  openModal,
  setCreatingLocalised
}: Props) => {
  const { updateItem, removeItem, addItem } = useTimetable();
  let longPressTimer: NodeJS.Timeout | undefined;

  // Web Right Click detection

  const wrapperRef = useRef<any>(null);

  useEffect(() => {
    const handleContextMenu = (event: SyntheticEvent) => {
      event.preventDefault();
      openModal();
    };

    const componentElement = wrapperRef.current;

    if (componentElement && Platform.OS === 'web') {
      componentElement.addEventListener('contextmenu', handleContextMenu);
    }

    // Cleanup event listener on component unmount
    return () => {
      if (componentElement && Platform.OS === 'web') {
        componentElement.removeEventListener('contextmenu', handleContextMenu);
      }
    };
  }, []);

  // GESTURE HANDLERS

  const handleTapIn = useCallback(async () => {
    if (invited) {
      return;
    }

    const markingAsDone = (
      item.status === ItemStatus.InProgress ||
      (Platform.OS !== 'web' && item.status === ItemStatus.Upcoming)
    );
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

    // On web, first click moves an item to inprogress
    if (Platform.OS === 'web') {
      if (item.status === ItemStatus.Upcoming) {
        updateItem(item, { status: ItemStatus.InProgress });
      } else if (item.status === ItemStatus.InProgress) {
        updateItem(item, { status: ItemStatus.Done });
      } else {
        updateItem(item, { status: ItemStatus.Upcoming });
      }
    } else {
      if (item.status === ItemStatus.Done) {
        updateItem(item, { status: ItemStatus.Upcoming });
      } else {
        updateItem(item, { status: ItemStatus.Done });
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy)
      }
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
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

    const itemReadyPromise = new Promise<void>(async (resolve) => {
      if (item.localised) {
        setCreatingLocalised(true);
        await addItem(item.type, item.sorting_rank, item).then(() => resolve());
      } else {
        resolve();
      }
    })

    itemReadyPromise.then(() => {
      openModal();
      setCreatingLocalised(false);
    });

    const closeAnimation = setInterval(() => {
      // Close after 500ms, unless the item is still not ready
      itemReadyPromise.then(() => animatedValues.offsetX.value = 0);
      clearTimeout(closeAnimation);
    }, 500);
  };

  const handleFlingRight = () => {
    if (invited) {
      openModal();
      return;
    }
    animatedValues.offsetX.value = 40;

    updateItem(item, { status: ItemStatus.InProgress });
    item.status !== ItemStatus.InProgress &&
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    // This makes the animation appear to pause for a second when slid back
    var closeAnimation = setInterval(() => {
      animatedValues.offsetX.value = 0;
      clearTimeout(closeAnimation);
    }, 500);
  };

  // GESTURE DEFINITIONS
  const tap = Gesture.Tap()
    .runOnJS(true)
    .onStart(() => handleTapIn())
    .onEnd(() => handleTapOut());
  const longPress = Gesture.LongPress()
    .runOnJS(true)
    .onStart(() => handleLongPressIn())
    .onEnd(() => handleLongPressOut());

  // TODO: Fix this to no longer require adjustment and no longer use pager-view prerelease package
  //
  // These stopped working properly after adding the topTabNavigator
  // The issue is that the drag value is inconsistent/incorrect after bumping
  //
  // The solution was to use pager-view prerelease as per https://github.com/callstack/react-native-pager-view/issues/713
  // and manually adjust this to track the value and arbitrary lower the drag threshold (typically 20px)
  let flingStartX: number;
  let flingStartY: number
  const flingLeft = Gesture.Fling()
    .direction(Directions.LEFT)
    .onBegin((event) => {
      flingStartX = event.absoluteX;
      flingStartY = event.absoluteY;
    })
    .onFinalize((event) => {
      const xDiff = event.absoluteX - flingStartX;
      const yDiff = event.absoluteY - flingStartY;

      const swipeAngleRadians = Math.atan(yDiff / xDiff);
      const swipeAngleDegrees = swipeAngleRadians * (180 / Math.PI);

      const angleActivatedChange = Math.abs(swipeAngleDegrees) < 20;

      if (angleActivatedChange && xDiff < -5) {
        handleFlingLeft();
      }
    })
    .runOnJS(true)
  const flingRight = Gesture.Fling()
    .direction(Directions.RIGHT)
    .onBegin((event) => {
      flingStartX = event.absoluteX;
      flingStartY = event.absoluteY;
    })
    .onFinalize((event) => {
      const xDiff = event.absoluteX - flingStartX;
      const yDiff = event.absoluteY - flingStartY;

      const swipeAngleRadians = Math.atan(yDiff / xDiff);
      const swipeAngleDegrees = swipeAngleRadians * (180 / Math.PI);

      const angleActivatedChange = Math.abs(swipeAngleDegrees) < 20;

      if (angleActivatedChange && xDiff > 5) {
        handleFlingRight();
      }
    })
    .runOnJS(true)

  const gestures = Gesture.Race(tap, longPress, flingLeft, flingRight);

  const scaleAnimation = useAnimatedStyle(() => ({
    transform: [{
      scale: withTiming(animatedValues.scale.value, {
        duration: SCALE_MS
      })}
  ]}));

  const conditionalStyles = {
    listItemWrapper: {
      // Dim the opacity if a task is cancelled or a user is only invited
      opacity: 
        item.status === ItemStatus.Cancelled || 
        invited ? 0.7 : 1
    }
  };

  return (
    <GestureDetector gesture={gestures}>
      <Animated.View
        ref={wrapperRef}
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
    height: 55,
    cursor: 'pointer'
  }
});
