import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { View, Text, StyleSheet } from "react-native";
import { useEffect } from "react";
import { Horizontal } from "../../components/MiscComponents";
import { ListInput } from "../../components/list/ListInput";
import {
  localisedMoment,
  dayFromDateString,
  formatDate,
  formatDateData,
  parseDateString,
} from "../../utils/dates";
import {
  DaysOfWeek,
  eventsBadgeColor,
  secondaryGreen,
  sleep,
} from "../../utils/constants";
import { LongPressGestureHandler } from "react-native-gesture-handler";
import * as Haptics from "expo-haptics";
import { ListItemType } from "../../components/list/constants";
import { useAuth } from "../../authorisation/AuthProvider";
import { useItems } from "../../hooks/useItems";

export const Day = ({ items, date = null, day = null, template = false }) => {
  const { user, updateUser } = useAuth();
  const { addItem, updateItem, removeItem } = useItems();
  const canDelete = date === user.timetable.first_day;

  const shiftFirst = async () => {
    if (canDelete) {
      opacity.value = 0;
      await sleep(500);
      var next = formatDateData(
        localisedMoment(parseDateString(user.timetable.first_day)).add(1, "day").toDate()
      );
      updateUser({
        ...user,
        timetable: { ...user.timetable, first_day: next },
      });
    }
  };
  // LONG PRESS HIDE GESTURE

  const opacity = useSharedValue(1);
  const scale = useSharedValue(1);
  const fadeAnimationStyle = useAnimatedStyle(() => {
    return {
      opacity: withTiming(opacity.value, {
        duration: 500,
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

  var timer;
  const handleLongPressIn = () => {
    if (canDelete) {
      scale.value = 1.09;

      // After the n seconds pressing, remove the item
      timer = setInterval(() => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
        shiftFirst();
        clearTimeout(timer);
      }, 400);
    }
  };

  const handleLongPressOut = () => {
    clearTimeout(timer);
    scale.value = 1;
  };

  return (
    <View>
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
              <Text style={styles.dayOfWeekText}>
                {day || dayFromDateString(date)}
              </Text>
            </View>

            {date && <Text style={styles.dayDateText}>{formatDate(date)}</Text>}
          </Animated.View>
        </LongPressGestureHandler>

        <View style={styles.listWrapperView}>
          <ListInput
            items={items.filter((x) => x.type === ListItemType.Event)}
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
            listBackgroundColor="black"
          />
        </View>

        <Horizontal
          style={{ borderColor: "rgba(255,255,255,0.5)", marginTop: 6 }}
        />

        <View style={styles.listWrapperView}>
          <ListInput
            items={items.filter((x) => x.type === ListItemType.Task)}
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
            listBackgroundColor="black"
          />
        </View>
      </Animated.View>
    </View>
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
    paddingVertical: 6,
    paddingHorizontal: 8,
    alignItems: "center",
  },
  dayDateText: {
    marginLeft: "auto",
    fontWeight: "300",
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
