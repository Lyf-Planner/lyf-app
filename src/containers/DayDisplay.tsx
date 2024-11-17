import { useCallback, useEffect, useMemo, useState } from 'react';
import { View, Text, StyleSheet, Platform, Alert } from 'react-native';

import * as Haptics from 'expo-haptics';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming
} from 'react-native-reanimated';
import debouncer from 'signature-debouncer';

import { BouncyPressable } from '@/components/BouncyPressable';
import { MultiTypeNewItem } from '@/components/MultiTypeNewItem';
import { Vertical } from '@/components/Vertical';
import { List } from '@/containers/List';
import { SortableList } from '@/containers/SortableList';
import { WeatherWidget } from '@/containers/WeatherWidget';
import { ItemStatus } from '@/schema/database/items';
import { LocalItem } from '@/schema/items';
import { DateString, DayOfWeek } from '@/schema/util/dates';
import { useAuthStore } from '@/store/useAuthStore';
import { useTimetableStore } from '@/store/useTimetableStore';
import {
  black,
  blackWithOpacity,
  deepBlueOpacity,
  secondaryGreen,
  transparent
} from '@/utils/colours';
import {
  dayFromDateString,
  formatDate,
  formatDateData,
  addDayToStringDate,
  parseDateString,
  daysDifferenceBetween,
  getStartOfCurrentWeek,
  currentDateString
} from '@/utils/dates';
import { sleep } from '@/utils/misc';

type Props = {
  items: LocalItem[],
  date: DateString | null,
  day: DayOfWeek | null,
  useRoutine?: boolean,
  shadowOffset?: { width: number, height: number }
}

const dayFinishingDebounceSignature = 'AUTO_DAY_FINISHING';

export const DayDisplay = ({ items, date, day, useRoutine = false, shadowOffset }: Props) => {
  const { reload, resortItems, startDate, endDate } = useTimetableStore();
  const { user, updateUser } = useAuthStore();
  const [sorting, setSorting] = useState<boolean | null>(null);
  const [sortOrder, setSortOrder] = useState<LocalItem[]>(items);

  const submitSortOrder = useCallback(() => {
    resortItems(sortOrder);
  }, [sortOrder]);

  useEffect(() => {
    if (!sorting && sorting !== null) {
      // If a timeout is not set, this runs before the bounce animation finishes
      // Due to threading (I think) the animation gets stuck halfway through
      setTimeout(() => submitSortOrder(), 100);
    }
  }, [sorting]);

  useEffect(() => {
    setSortOrder(items);
  }, [items]);

  const allDone = useMemo(
    () =>
      !items.find(
        (x) => x.status !== ItemStatus.Done && x.status !== ItemStatus.Cancelled
      ),
    [items]
  );
  const canFinish = useMemo(
    () =>
      !useRoutine &&
      date &&
      date.localeCompare(formatDateData(new Date())) < 0 &&
      allDone,
    [allDone, date, useRoutine]
  );

  // Day finishing animation

  const opacity = useSharedValue(1);
  const scale = useSharedValue(1);
  const offset = useSharedValue(0);

  const DELAY = 400;

  const exitingAnimation = useAnimatedStyle(() => ({
    transform: [{
      scale: withTiming(scale.value, {
        duration: DELAY
      }) }, {
      translateX: offset.value
    }],
    opacity: withTiming(opacity.value, {
      duration: 500
    })
  }));

  // Day handle bounce animation

  const dayHandleScale = useSharedValue(1);
  const smallScaleAnimation = useAnimatedStyle(() => ({
    transform: [{
      scale: withTiming(dayHandleScale.value, {
        duration: 250
      })
    }]
  }));

  const bounceHandle = async () => {
    const bounceDuration = 250;
    dayHandleScale.value = 1.03;
    await sleep(bounceDuration);
    dayHandleScale.value = 1;
    await sleep(bounceDuration);
    dayHandleScale.value = 1.03;
    await sleep(bounceDuration);
    dayHandleScale.value = 1;
  };

  useEffect(() => {
    if (canFinish && date) {
      bounceHandle();

      // Automatic day finishing
      // If all tasks are done, we are in front of the current first_day, and behind the current day, move first_day to next day.
      const firstDay = user?.first_day || formatDateData(getStartOfCurrentWeek());

      const aheadOfFirstDay = date.localeCompare(firstDay) > 0;
      const behindCurrentDay = date.localeCompare(currentDateString()) < 0;
      console.log('dates', { behindCurrentDay, aheadOfFirstDay, firstDay });

      if (aheadOfFirstDay && behindCurrentDay && user?.auto_day_finishing) {
        console.log(`Automatically finishing day ${date} ${JSON.stringify({ behindCurrentDay, aheadOfFirstDay, firstDay })}`)
        const nextDay = addDayToStringDate(date);
        // debounce in case other days are also finishing - by default the most recent day will run this last
        debouncer.run(() => updateUser({ first_day: nextDay }), dayFinishingDebounceSignature, 500);
      }
    }
  }, [canFinish, user]);

  const finishDay = () => {
    if (!date || user?.auto_day_finishing) {
      return;
    }

    const isFutureDay = parseDateString(date).getTime() > new Date().getTime();
    if (isFutureDay) {
      return;
    }

    const shiftAmount = daysDifferenceBetween(startDate, endDate) - 1;

    const newStart = addDayToStringDate(date, 1);
    const newEnd = addDayToStringDate(newStart, shiftAmount);

    if (Platform.OS === 'web') {
      const confirmDayFinish = confirm('Finish Day?');
      if (confirmDayFinish) {
        reload(newStart, newEnd).then(() => updateUser({ first_day: newStart }));
      }
    } else {
      Alert.alert(
        allDone ? 'Finish Day' : 'Finish Day?',
        allDone ? 'All items are completed' : 'Not all items are completed',
        [
          {
            text: 'Cancel',
            onPress: () => console.log('Day Finish Cancelled'),
            isPreferred: !allDone
          },
          {
            text: 'Confirm',
            onPress: async () => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
              reload(newStart, newEnd).then(() => updateUser({ first_day: newStart }));
            },
            isPreferred: allDone
          }
        ],
        { cancelable: true }
      );
    }
  }

  const conditionalStyles = {
    dayRootView: {
      shadowOffset: shadowOffset ?? { width: 3, height: 3 }
    }
  }

  return (
    <Animated.View style={[styles.dayRootView, conditionalStyles.dayRootView, exitingAnimation]}>
      <BouncyPressable
        onPress={() => setSorting(!sorting)}
        onLongPress={() => finishDay()}
      >
        <Animated.View style={[styles.dayHeaderView, smallScaleAnimation]}>
          <WeatherWidget date={date || day || ''} />
          <View style={styles.dayOfWeekPressable}>
            <Text style={styles.dayOfWeekText}>
              {day || (date && dayFromDateString(date))}
            </Text>

          </View>
          <View style={styles.headerEnd}>
            <Vertical style={styles.diagLines} />
            {canFinish && <Vertical style={styles.diagLines} />}

            {date && (
              <Text style={styles.dayDateText}>{formatDate(date, true)}</Text>
            )}
          </View>
        </Animated.View>
      </BouncyPressable>

      <View style={styles.listWrapperView}>
        {sorting ? (
          <SortableList
            setSortOrder={setSortOrder}
            sortOrder={sortOrder}
            itemStyleOptions={{
              itemTextColor: black
            }}
            listWrapperStyles={styles.transparentBackground}
          />
        ) : (
          <List
            items={items}
            itemStyleOptions={{
              itemTextColor: black
            }}
            listWrapperStyles={styles.transparentBackground}
          />
        )}

        {sorting ? (
          <BouncyPressable style={styles.doneButton} onPress={() => {
            submitSortOrder();
            setSorting(false)
          }}>
            <Text style={styles.doneText}>Done</Text>
          </BouncyPressable>
        ) : (
          <MultiTypeNewItem
            commonData={{
              date: date || undefined,
              day: day || undefined
            }}
            newRank={items.length}
          />
        )}
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  dayDateText: {
    fontFamily: 'Lexend',
    fontSize: 16,
    marginLeft: 16,
    paddingRight: 2
  },
  dayHeaderView: {
    alignItems: 'center',
    backgroundColor: secondaryGreen,
    borderRadius: 10,
    flexDirection: 'row',
    overflow: 'visible',
    paddingHorizontal: 8
  },
  dayOfWeekPressable: {
    borderRadius: 10,
    paddingHorizontal: 2,
    paddingVertical: 14
  },
  dayOfWeekText: {
    fontFamily: 'Lexend',
    fontSize: 18,
    fontWeight: '600',
    padding: 2
  },
  dayRootView: {
    backgroundColor: deepBlueOpacity(Platform.OS !== 'ios' ? 0.9 : 0.6),
    borderRadius: 10,
    borderWidth: 1,
    flexDirection: 'column',
    gap: 4,
    padding: 10,
    shadowColor: black,
    shadowOpacity: 0.75,

    shadowRadius: 2,
    width: '100%',
    zIndex: 10
  },
  diagLines: {
    borderColor: blackWithOpacity(0.2),
    borderLeftWidth: 2,
    height: '100%',
    marginLeft: 'auto',
    transform: [{ rotateZ: '-20deg' }]
  },
  doneButton: {
    alignItems: 'center',
    backgroundColor: secondaryGreen,
    borderColor: black,
    borderRadius: 10,
    borderWidth: 1,
    flexDirection: 'row',
    height: 55,
    justifyContent: 'center',
    paddingHorizontal: 8,
    paddingVertical: 8,
    width: '100%'
  },
  doneText: {
    color: black,
    fontFamily: 'Lexend',
    fontSize: 17
  },

  headerEnd: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 2,
    height: '100%',
    marginLeft: 'auto',
    marginRight: 2
  },
  listWrapperView: {
    flexDirection: 'column',
    gap: 2,
    marginTop: 2
  },

  transparentBackground: {
    backgroundColor: transparent
  }
});
