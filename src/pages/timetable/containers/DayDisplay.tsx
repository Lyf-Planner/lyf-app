import { View, Text, StyleSheet, Vibration, Pressable } from 'react-native';
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
  deepBlue,
  eventsBadgeColor,
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
import { useEffect, useMemo, useState } from 'react';
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
import { NewItem } from 'components/list/NewItem';
import { MultiTypeNewItem } from 'components/list/MultiTypeNewItem';

type Props = {
  items: LocalItem[],
  date: DateString | null,
  day: DayOfWeek | null,
  useRoutine?: boolean
}

export const DayDisplay = ({ items, date, day, useRoutine = false }: Props) => {
  const [sorting, setSorting] = useState(false);

  const { user, updateUser } = useAuth();
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

  // Shift the users preferred start day one ahead - this is how we remove it implicitly
  const shiftFirst = async () => {
    if (canDelete && removeQueued.value) {
      opacity.value = 0;
      scale.value = 1.5;

      await sleep(500);
      const currentFirst = date || formatDateData(new Date())
      const next = formatDateData(
        localisedMoment(parseDateString(currentFirst)).add(1, 'day').toDate()
      );

      updateUser({
        ...user,
        first_day: next
      });
    }
  };

  // Day finishing animation

  const removeQueued = useSharedValue(false);
  const opacity = useSharedValue(1);
  const scale = useSharedValue(1);
  const offset = useSharedValue(0);

  const SHAKE_OFFSET = 1;
  const SHAKE_TIME = 30;
  const DELAY = 400;

  const exitingAnimation = useAnimatedStyle(() => {
    return {
      transform: [
        {
          scale: withTiming(scale.value, {
            duration: DELAY
          })
        },
        { translateX: offset.value }
      ],
      opacity: withTiming(opacity.value, {
        duration: 500
      })
    } as any;
  });

  const finishDay = async () => {
    if (canDelete) {
      removeQueued.value = true;
      scale.value = 1.05;
      await sleep(DELAY);

      // Runs for (TOTAL_SHAKES + 1) * SHAKE_TIME
      const TOTAL_SHAKES = 10;
      offset.value = withSequence(
        // start from -OFFSET
        withTiming(-SHAKE_OFFSET, { duration: SHAKE_TIME / 2 }),
        // shake between -OFFSET and OFFSET TOTAL_SHAKES times
        withRepeat(
          withTiming(SHAKE_OFFSET, { duration: SHAKE_TIME }),
          TOTAL_SHAKES,
          true
        ),
        // go back to 0 at the end
        withTiming(0, { duration: SHAKE_TIME / 2 })
      );

      Vibration.vibrate(DELAY / 2);
      scale.value = 1.06;

      await sleep(DELAY);
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
      shiftFirst();
    }
  };

  // Day handle bounce animation

  const dayHandleScale = useSharedValue(1);
  const smallScaleAnimation = useAnimatedStyle(() => {
    return {
      transform: [
        {
          scale: withTiming(dayHandleScale.value, {
            duration: 250
          })
        }
      ]
    } as any;
  });

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

  // Menu stuff

  const buildMenuOptions = () => {
    const menuOptions: PopoverMenuOption[] = [];

    // Finish day if ready
    if (canDelete) {
      menuOptions.push({
        text: '✅ Finish Day',
        onSelect: () => finishDay()
      });
    }

    // Sort tasks if more than one
    menuOptions.push({
      text: '↕️ Sort Tasks',
      onSelect: () => setSorting(true)
    });

    return menuOptions;
  };

  const conditionalStyles = {
    dayRootView: allDone ? {
      
    } : {

    }
  }


  return (
    <View>
      <Animated.View style={[styles.dayRootView, exitingAnimation]}>
        <LyfMenu
        // TODO: This sucks
          name={(date ? date : day) + "-menu"} 
          placement={MenuPopoverPlacement.Top}
          options={buildMenuOptions()}
        >
          <BouncyPressable onPress={() => console.log('opening menu')} disabled>
            <Animated.View style={[styles.dayHeaderView, smallScaleAnimation]}>
              <View style={styles.dayOfWeekPressable}>
                <Text style={styles.dayOfWeekText}>
                  {day || (date && dayFromDateString(date))}
                </Text>
              </View>
              <View style={styles.headerEnd}>
                <Vertical style={styles.diagLines} />
                <Vertical style={styles.diagLines} />

                {date && (
                  <Text style={styles.dayDateText}>{formatDate(date)}</Text>
                )}
              </View>
            </Animated.View>
          </BouncyPressable>
        </LyfMenu>

        <View style={styles.listWrapperView}>
          {sorting ? (
            <SortableList
              items={items.filter((x) => x.type === ItemType.Task)}
              itemStyleOptions={{
                itemColor: 'rgb(241 245 249)',
                itemTextColor: 'black'
              }}
              listWrapperStyles={{ backgroundColor: deepBlue }}
              doneSorting={() => setSorting(false)}
            />
          ) : (
            <List
              items={items.sort((a, b) => {
                if (a.time && b.time) {
                  return a.time.localeCompare(b.time)
                }

                if (a.time) {
                  return -1;
                }

                return 1;
              })}
              itemStyleOptions={{
                itemColor: eventsBadgeColor,
                itemTextColor: 'black'
              }}
              listWrapperStyles={{ backgroundColor: deepBlue }}
            />
          )}
        </View>

        <MultiTypeNewItem 
          commonData={{
            date: date || undefined,
            day: day || undefined
          }} 
          newRank={items.length}
        />
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  dayRootView: {
    backgroundColor: deepBlue,
    width: '100%',
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
    zIndex: 10,
    flexDirection: 'column',
    gap: 4,

  
    shadowOffset: { width: 5, height: 6 },
    shadowColor: 'black',
    shadowOpacity: 0.5,
    shadowRadius: 1

    // shadowColor: 'black',
    // shadowOffset: { width: 5, height: 5 },
    // shadowOpacity: 0.5,
    // shadowRadius: 0.5
  },
  dayHeaderView: {
    backgroundColor: secondaryGreen,
    borderRadius: 10,
    flexDirection: 'row',
    paddingHorizontal: 8,
    alignItems: 'center'
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
    borderColor: deepBlue,
    opacity: 0.2,
    borderLeftWidth: 2,
    height: '140%',
    transform: [{ rotateZ: '-20deg' }],
    marginLeft: 'auto'
  },
  dayDateText: {
    fontWeight: '300',
    paddingRight: 2,
    marginLeft: 16,
    fontSize: 18,
    fontFamily: 'Lexend'
  },
  dayOfWeekText: {
    fontFamily: 'Lexend-Semibold',
    fontSize: 20,
    padding: 2
  },
  dayOfWeekPressable: {
    borderRadius: 10,
    paddingHorizontal: 2,
    paddingVertical: 14
  },
  listWrapperView: {
    flexDirection: 'column'
  },
  listTopicText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '500'
  },
  
});
