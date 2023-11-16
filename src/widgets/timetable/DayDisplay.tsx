import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { View, TouchableHighlight, Text, StyleSheet } from "react-native";
import { useEffect, useState } from "react";
import { Horizontal } from "../../components/MiscComponents";
import { ListInput } from "../../components/list/ListInput";
import { formatDate } from "../../utils/dates";
import { eventsBadgeColor, secondaryGreen } from "../../utils/constants";
import {
  Gesture,
  GestureDetector,
  LongPressGestureHandler,
} from "react-native-gesture-handler";
import * as Haptics from "expo-haptics";

export const Day = ({ dayData, updateDay }: any) => {
  const updateEvents = (events: string[]) => updateDay({ ...dayData, events });
  const updateTasks = (tasks: string[]) => updateDay({ ...dayData, tasks });
  const updateMetadata = (metadata: string) =>
    updateDay({ ...dayData, metadata });

  // LONG PRESS HIDE GESTURE

  const opacity = useSharedValue(1);
  const scale = useSharedValue(1);
  const willRemove = useSharedValue(false);
  const fadeAnimationStyle = useAnimatedStyle(() => {
    return {
      opacity: withTiming(opacity.value, {
        duration: 400,
      }),
    } as any;
  });
  const scaleAnimation = useAnimatedStyle(() => {
    return {
      transform: [
        {
          scale: withTiming(scale.value, {
            duration: 400,
          }),
        },
      ],
    } as any;
  });

  const hideDay = () => {
    opacity.value = 0;
    var timer = setInterval(() => {
      updateDay({ ...dayData, hidden: true });
      clearInterval(timer);
    }, 400);
  };

  var timer;
  const handleLongPressIn = () => {
    scale.value = 1.09;

    // After the n seconds pressing, remove the item
    timer = setInterval(() => {
      console.log("timer called!");
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
      hideDay();
      clearTimeout(timer);
    }, 400);
  };

  const handleLongPressOut = () => {
    clearTimeout(timer);
    scale.value = 1;
  };

  // When 'unhiding' a day we need to reinitialise these
  useEffect(() => {
    opacity.value = 1;
    scale.value = 1;
    willRemove.value = false;
  }, [dayData]);

  if (dayData.hidden) return null;

  return (
    <Animated.View
      style={[styles.dayRootView, fadeAnimationStyle, scaleAnimation]}
    >
      <LongPressGestureHandler
        onBegan={handleLongPressIn}
        onCancelled={handleLongPressOut}
        onEnded={handleLongPressOut}
        onFailed={handleLongPressOut}
      >
        <Animated.View style={[styles.dayHeaderView]}>
          <View style={styles.dayOfWeekPressable}>
            <Text style={styles.dayOfWeekText}>{dayData.day}</Text>
          </View>

          <Text style={styles.dayDateText}>
            {dayData.date && formatDate(dayData.date)}
            {/* Should add a preferred format selection! */}
          </Text>
        </Animated.View>
      </LongPressGestureHandler>

      <View style={styles.listWrapperView}>
        <ListInput
          list={dayData.events || []}
          updateList={updateEvents}
          badgeColor={eventsBadgeColor}
          placeholder="Add Event +"
          listBackgroundColor="black"
          isEvents
        />
      </View>

      <Horizontal
        style={{ borderColor: "rgba(255,255,255,0.5)", marginTop: 6 }}
      />

      <View style={styles.listWrapperView}>
        <ListInput
          list={dayData.tasks || []}
          updateList={updateTasks}
          badgeColor="rgb(241 245 249)"
          placeholder="Add Task +"
          listBackgroundColor="black"
        />
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  dayRootView: {
    backgroundColor: "black",
    width: "100%",
    borderRadius: 10,
    padding: 10,
    elavation: 1,
    zIndex: 10,
    flexDirection: "column",
  },
  dayHeaderView: {
    backgroundColor: secondaryGreen,
    borderRadius: 10,
    flexDirection: "row",
    paddingVertical: 4,
    paddingHorizontal: 6,
    alignItems: "center",
  },
  dayDateText: {
    marginLeft: "auto",
    paddingHorizontal: 2,
    fontSize: 16,
  },
  dayOfWeekText: {
    fontWeight: "600",
    fontSize: 18,
  },
  dayOfWeekPressable: {
    borderRadius: 10,
    paddingHorizontal: 2,
    paddingVertical: 6,
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
