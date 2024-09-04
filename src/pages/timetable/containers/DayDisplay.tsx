import { View, Text, StyleSheet, Vibration, Platform } from 'react-native';
import { Horizontal, Vertical } from '../../../components/general/MiscComponents';
import { List } from '../../../components/list/List';
import {
  localisedMoment,
  dayFromDateString,
  formatDate,
  formatDateData,
  parseDateString
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
  const { resortItems } = useTimetable();
  const [sorting, setSorting] = useState(false);
  const [sortOrder, setSortOrder] = useState<LocalItem[]>(items);

  const submitSortOrder = useCallback(() => {
    resortItems(sortOrder);
  }, [sortOrder])

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

  const conditionalStyles = {
    dayRootView: {
      shadowOffset: shadowOffset ?? { width: 3, height: 3 },
    }
  }

  return (
    <View>
      <Animated.View style={[styles.dayRootView, conditionalStyles.dayRootView, exitingAnimation]}>
        <BouncyPressable 
          onPress={() => {
            if (sorting) {
              submitSortOrder();
            }
            setSorting(!sorting);
          }}
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
              items={items.sort((a, b) => 
                a.sorting_rank - b.sorting_rank
              )}
              itemStyleOptions={{
                itemTextColor: 'black'
              }}
              listWrapperStyles={{ backgroundColor: 'transparent' }}
            />
          )}
        </View>

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
      </Animated.View>
    </View>
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
    fontWeight: '300',
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
    marginTop: 2
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
