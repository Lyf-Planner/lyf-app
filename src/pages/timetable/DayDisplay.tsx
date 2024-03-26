import { View, Text, StyleSheet, Vibration } from "react-native";
import { Horizontal, Vertical } from "../../components/general/MiscComponents";
import { ListInput } from "../../components/list/ListInput";
import {
  localisedMoment,
  dayFromDateString,
  formatDate,
  formatDateData,
  parseDateString,
} from "../../utils/dates";
import {
  deepBlue,
  eventsBadgeColor,
  secondaryGreen,
  sleep,
} from "../../utils/constants";
import { LongPressGestureHandler } from "react-native-gesture-handler";
import { ItemStatus, ListItemType } from "../../components/list/constants";
import { useAuth } from "../../authorisation/AuthProvider";
import { useItems } from "../../hooks/useItems";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from "react-native-reanimated";
import { useEffect, useMemo } from "react";
import * as Haptics from "expo-haptics";

export const Day = ({ items, date = null, day = null, template = false }) => {
  const { user, updateUser } = useAuth();
  const { addItem, updateItem, removeItem } = useItems();
  const allDone = useMemo(
    () =>
      !items.find(
        (x) => x.status !== ItemStatus.Done && x.status !== ItemStatus.Cancelled
      ),
    [items]
  );
  const canDelete = useMemo(
    () =>
      !template &&
      date &&
      date.localeCompare(formatDateData(new Date())) < 1 &&
      allDone,
    [allDone, date, template]
  );

  const shiftFirst = async () => {
    if (canDelete && removeQueued.value) {
      opacity.value = 0;
      scale.value = 1.5;
      await sleep(500);
      var next = formatDateData(
        localisedMoment(parseDateString(date)).add(1, "day").toDate()
      );
      updateUser({
        ...user,
        timetable: { ...user.timetable, first_day: next },
      });
    }
  };
  // LONG PRESS HIDE GESTURE

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
            duration: DELAY,
          }),
        },
        { translateX: offset.value },
      ],
      opacity: withTiming(opacity.value, {
        duration: 500,
      }),
    } as any;
  });

  const handleLongPressIn = async () => {
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

  const handleLongPressOut = () => {
    if (removeQueued.value) return;
    scale.value = 1;
    offset.value = 0;
    removeQueued.value = false;
  };

  // Day handle animation

  const dayHandleScale = useSharedValue(1);
  const smallScaleAnimation = useAnimatedStyle(() => {
    return {
      transform: [
        {
          scale: withTiming(dayHandleScale.value, {
            duration: 250,
          }),
        },
      ],
    } as any;
  });

  useEffect(() => {
    if (canDelete && date.localeCompare(formatDateData(new Date())) < 1) {
      bounceHandle();
    }
  }, [canDelete]);

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

  return (
    <View>
      <Animated.View style={[styles.dayRootView, exitingAnimation]}>
        <LongPressGestureHandler
          onBegan={handleLongPressIn}
          onCancelled={handleLongPressOut}
          onEnded={handleLongPressOut}
          onFailed={handleLongPressOut}
        >
          <Animated.View style={[styles.dayHeaderView, smallScaleAnimation]}>
            <View style={styles.dayOfWeekPressable}>
              <Text style={styles.dayOfWeekText}>
                {day || dayFromDateString(date)}
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
        </LongPressGestureHandler>

        <View style={styles.listWrapperView}>
          <ListInput
            items={items
              .filter((x) => x.type === ListItemType.Event)
              .sort((a, b) => (a.time ? a.time.localeCompare(b.time) : 1))}
            addItem={(name) =>
              addItem(
                name,
                ListItemType.Event,
                template ? null : date,
                template ? day : null
              )
            }
            updateItem={updateItem}
            removeItem={removeItem}
            type={ListItemType.Event}
            badgeColor={eventsBadgeColor}
            listBackgroundColor={deepBlue}
          />
        </View>

        <Horizontal
          style={{ borderColor: "rgba(255,255,255,0.5)", marginTop: 6 }}
        />

        <View style={styles.listWrapperView}>
          <ListInput
            items={items
              .filter((x) => x.type === ListItemType.Task)
              .sort((a, b) => (a.time ? a.time.localeCompare(b.time) : 1))}
            addItem={(name) =>
              addItem(
                name,
                ListItemType.Task,
                template ? null : date,
                template ? day : null
              )
            }
            updateItem={updateItem}
            removeItem={removeItem}
            type={ListItemType.Task}
            badgeColor="rgb(241 245 249)"
            listBackgroundColor={deepBlue}
          />
        </View>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  dayRootView: {
    backgroundColor: deepBlue,
    width: "100%",
    borderRadius: 10,
    padding: 10,
    zIndex: 10,
    flexDirection: "column",
  },
  dayHeaderView: {
    backgroundColor: secondaryGreen,
    borderRadius: 10,
    flexDirection: "row",
    paddingHorizontal: 8,
    alignItems: "center",
  },
  headerEnd: {
    flexDirection: "row",
    height: "100%",
    alignItems: "center",
    gap: 2,
    marginLeft: "auto",
    marginRight: 2,
  },
  diagLines: {
    borderColor: deepBlue,
    opacity: 0.2,
    borderLeftWidth: 2,
    height: "140%",
    transform: [{ rotateZ: "-20deg" }],
    marginLeft: "auto",
  },
  dayDateText: {
    fontWeight: "300",
    paddingRight: 2,
    marginLeft: 16,
    fontSize: 16,
    fontFamily: "Inter",
  },
  dayOfWeekText: {
    fontWeight: "600",
    fontFamily: "InterSemi",
    fontSize: 18,
    padding: 2,
  },
  dayOfWeekPressable: {
    borderRadius: 10,
    paddingHorizontal: 2,
    paddingVertical: 14,
  },
  listWrapperView: {
    flexDirection: "column",
  },
  listTopicText: {
    color: "white",
    fontSize: 16,
    fontWeight: "500",
  },
});
