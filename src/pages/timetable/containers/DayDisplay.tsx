import { View, Text, StyleSheet, Vibration, Platform, Alert } from 'react-native';
import { Horizontal, Vertical } from '../../../components/general/MiscComponents';
import { List } from '../../../components/list/List';
import {
  localisedMoment,
  dayFromDateString,
  formatDate,
  formatDateData,
  dateWithTime,
  addDayToStringDate,
  parseDateString,
  daysDifferenceBetween,
  getStartOfCurrentWeek
} from '../../../utils/dates';
import {
  black,
  deepBlue,
  deepBlueOpacity,
  eventsBadgeColor,
  lightGreen,
  primaryGreenWithOpacity,
  secondaryGreen,
} from '../../../utils/colours';
import { sleep } from 'utils/misc';
import { useAuth } from 'providers/cloud/useAuth';
import { useTimetable } from 'providers/cloud/useTimetable';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming
} from 'react-native-reanimated';
import { SyntheticEvent, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { BouncyPressable } from '../../../components/pressables/BouncyPressable';
import {
  LyfMenu,
  MenuPopoverPlacement,
  PopoverMenuOption
} from '../../../components/menus/LyfMenu';
import { SortableList } from '../../../components/list/SortableList';
import * as Haptics from 'expo-haptics';
import { LocalItem } from 'schema/items';
import { DateString, DayOfWeek } from 'schema/util/dates';
import { ItemStatus, ItemType } from 'schema/database/items';
import { MultiTypeNewItem } from 'components/list/MultiTypeNewItem';
import { WeatherWidget } from 'components/weather/WeatherWidget';

type Props = {
  items: LocalItem[],
  date: DateString | null,
  day: DayOfWeek | null,
  useRoutine?: boolean,
  shadowOffset?: { width: number, height: number }
}



export const DayDisplay = ({ items, date, day, useRoutine = false, shadowOffset }: Props) => {
  const { reload, resortItems, startDate, endDate } = useTimetable();
  const { updateUser } = useAuth();
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
  const canDelete = useMemo(
    () =>
      !useRoutine &&
      date &&
      date.localeCompare(formatDateData(new Date())) < 1 &&
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
      })}, { 
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
    if (canDelete && date && date.localeCompare(formatDateData(new Date())) < 1) {
      bounceHandle();
    }
  }, [canDelete]);

  const finishDay = () => {
    if (!date) {
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
          },
        ],
        {cancelable: true},
      );
    }

    
  }

  const conditionalStyles = {
    dayRootView: {
      shadowOffset: shadowOffset ?? { width: 3, height: 3 },
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
              {canDelete && <Vertical style={styles.diagLines} />}

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
                itemColor: 'rgb(241 245 249)',
                itemTextColor: 'black'
              }}
              listWrapperStyles={{ backgroundColor: 'transparent' }}
            />
          ) : (
            <List
              items={items}
              itemStyleOptions={{
                itemTextColor: 'black'
              }}
              listWrapperStyles={{ backgroundColor: 'transparent' }}
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
  dayRootView: {
    backgroundColor: deepBlueOpacity(Platform.OS !== 'ios' ? 0.9 : 0.6),
    width: '100%',
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
    zIndex: 10,
    flexDirection: 'column',
    gap: 4,

    shadowColor: 'black',
    shadowOpacity: 0.75,
    shadowRadius: 2
  },
  dayHeaderView: {
    backgroundColor: secondaryGreen,
    borderRadius: 10,
    flexDirection: 'row',
    paddingHorizontal: 8,
    alignItems: 'center',
    overflow: 'visible',
  },
  headerEnd: {
    flexDirection: 'row',
    height: '100%',
    alignItems: 'center',
    gap: 2,
    marginLeft: 'auto',
    marginRight: 2
  },
  diagLines: {
    borderLeftWidth: 2,
    borderColor: 'rgba(0,0,0,0.2)',
    height: '100%',
    transform: [{ rotateZ: '-20deg' }],
    marginLeft: 'auto'
  },
  dayDateText: {
    paddingRight: 2,
    marginLeft: 16,
    fontSize: 16,
    fontFamily: 'Lexend'
  },
  dayOfWeekText: {
    fontFamily: 'Lexend',
    fontWeight: '600',
    fontSize: 18,
    padding: 2
  },
  dayOfWeekPressable: {
    borderRadius: 10,
    paddingHorizontal: 2,
    paddingVertical: 14
  },
  listWrapperView: {
    flexDirection: 'column',
    marginTop: 2,
    gap: 2,
  },

  doneButton: {
    height: 55,
    borderRadius: 10,
    backgroundColor: secondaryGreen,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 8,
    width: '100%',
    borderColor: 'rgb(156 163 175)',
    borderWidth: 1
  },
  doneText: {
    fontFamily: 'Lexend',
    fontSize: 17,
    color: 'black',
  }
  
});
