import { StyleSheet, View, Text } from "react-native";
import Animated, {
  useSharedValue,
  withTiming,
  useAnimatedStyle,
} from "react-native-reanimated";
import {
  GestureDetector,
  Gesture,
  Directions,
} from "react-native-gesture-handler";
import { ITEM_STATUS_TO_COLOR, ItemStatus, ListItemType } from "../constants";
import { TwentyFourHourToAMPM } from "../../../utils/dates";
import { ListItemDrawer } from "../ListItemDrawer";
import { useDrawer } from "../../../hooks/useDrawer";
import { LinearGradient } from "expo-linear-gradient";
import { deepBlue, primaryGreen, sleep } from "../../../utils/constants";
import { useCallback, useMemo } from "react";
import { useAuth } from "../../../authorisation/AuthProvider";
import { Vertical } from "../../general/MiscComponents";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import AntDesign from "react-native-vector-icons/AntDesign";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import * as Haptics from "expo-haptics";

const SCALE_MS = 180;

export const ListItem = ({
  item,
  updateItem,
  removeItem,
  badgeColor,
  badgeTextColor,
  fromNote = false,
}) => {
  const { updateDrawer, updateSheetMinHeight } = useDrawer();
  const { user } = useAuth();
  const invited = useMemo(
    () =>
      item?.invited_users &&
      !!item.invited_users.find((x) => x.user_id === user.id),
    [item.invited_users, user]
  );
  if (!item) return null;

  const openModal = async () => {
    const invitedRoutineInstantiation = invited && item.template_id;
    updateDrawer(null);
    // Create any localised items for drawer to find
    if (item.localised && !invitedRoutineInstantiation) await updateItem(item);

    updateDrawer(
      <ListItemDrawer
        // Invites to templates should open the template!
        item_id={invitedRoutineInstantiation ? item.template_id : item.id}
        closeDrawer={() => updateDrawer(null)}
        updateSheetMinHeight={updateSheetMinHeight}
        preloaded={fromNote ? item : null}
        updatePreloaded={fromNote ? updateItem : null}
      />
    );
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
  const flingLeft = Gesture.Fling()
    .direction(Directions.LEFT)
    .runOnJS(true)
    .onEnd(() => handleFlingLeft());
  const flingRight = Gesture.Fling()
    .direction(Directions.RIGHT)
    .runOnJS(true)
    .onEnd(() => handleFlingRight());

  const gestures = Gesture.Race(tap, longPress, flingLeft, flingRight);

  // ANIMATION DEFINITIONS

  const scale = useSharedValue(1);
  const offsetX = useSharedValue(0);
  const checkScale = useSharedValue(1);

  var timer = null;
  const scaleAnimation = useAnimatedStyle(() => {
    return {
      transform: [
        {
          scale: withTiming(scale.value, {
            duration: SCALE_MS,
          }),
        },
      ],
    } as any;
  });
  const flickAnimation = useAnimatedStyle(
    () =>
      ({
        transform: [
          {
            translateX: withTiming(offsetX.value, {
              duration: 250,
            }),
          },
        ],
        zIndex: 50,
      } as any)
  );
  const checkScaleAnimation = useAnimatedStyle(() => {
    return {
      transform: [
        {
          scale: withTiming(checkScale.value, {
            duration: SCALE_MS,
          }),
        },
      ],
    } as any;
  });

  // GESTURE HANDLERS

  const handleTapIn = useCallback(async () => {
    if (invited) return;

    const markingAsDone = item.status !== ItemStatus.Done;
    scale.value = markingAsDone ? 0.7 : 0.9;
    await sleep(SCALE_MS);

    scale.value = markingAsDone ? 1.1 : 1;
    await sleep(SCALE_MS);
    markingAsDone && Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);

    scale.value = 1;
    checkScale.value = markingAsDone ? 1.5 : 1;
    await sleep(SCALE_MS);

    checkScale.value = 1;
  }, [item.status]);

  const handleTapOut = () => {
    if (invited) {
      openModal();
      return;
    }

    if (item.status === ItemStatus.Done) {
      updateItem({ ...item, status: ItemStatus.Upcoming });
    } else {
      updateItem({ ...item, status: ItemStatus.Done });
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    }
  };

  const handleLongPressIn = () => {
    if (invited) return;
    // Start animating the shrinking of the item while user holds it down

    scale.value = 0.75;

    // After the n seconds pressing, remove the item
    timer = setInterval(() => {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
      removeItem(item, true);
      clearTimeout(timer);
    }, 250);
  };

  const handleLongPressOut = () => {
    if (invited) {
      openModal();
      return;
    }
    clearTimeout(timer);
    scale.value = 1;
  };

  const handleFlingLeft = () => {
    offsetX.value = -40;

    openModal();
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

    // This makes the animation appear to pause for a second when slid back
    var closeAnimation = setInterval(() => {
      offsetX.value = 0;
      clearTimeout(closeAnimation);
    }, 500);
  };

  const handleFlingRight = () => {
    if (invited) {
      openModal();
      return;
    }
    offsetX.value = 40;

    updateItem({ ...item, status: ItemStatus.InProgress });
    item.status !== ItemStatus.InProgress &&
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    // This makes the animation appear to pause for a second when slid back
    var closeAnimation = setInterval(() => {
      offsetX.value = 0;
      clearTimeout(closeAnimation);
    }, 500);
  };

  // STYLING

  const determineBadgeColor = () => {
    if (!item.status || item.status === ItemStatus.Upcoming) return badgeColor;
    else return ITEM_STATUS_TO_COLOR[item.status];
  };

  const determineBadgeTextColor = () => {
    if (item.status === ItemStatus.Done) return "white";
    if (item.status === ItemStatus.InProgress) return "black";
    if (item.status === ItemStatus.Tentative) return "black";
    if (item.status === ItemStatus.Cancelled) return "black";
    else return badgeTextColor;
  };

  const getTimeText = () => {
    if (item.end_time && item.time) {
      const amPmSlicePosition = -2;

      const potentialTime = TwentyFourHourToAMPM(item.time);
      const endTime = TwentyFourHourToAMPM(item.end_time);

      // Remove AMPM from time to save space, if it's the same as the end time
      const sameAMPM =
        potentialTime.slice(amPmSlicePosition) ===
        endTime.slice(amPmSlicePosition);
      const time = sameAMPM
        ? TwentyFourHourToAMPM(item.time, false)
        : potentialTime;

      return time + "-" + endTime;
    } else if (item.time) {
      const time = TwentyFourHourToAMPM(item.time);
      return time;
    } else return;
  };

  return (
    <GestureDetector gesture={gestures}>
      <Animated.View
        style={[
          scaleAnimation,
          {
            opacity: item.status === ItemStatus.Cancelled || invited ? 0.7 : 1,
            width: "100%",
          },
        ]}
      >
        <Animated.View
          style={[
            styles.listItem,
            flickAnimation,
            {
              backgroundColor: determineBadgeColor(),
              borderRadius: item.type !== ListItemType.Task ? 5 : 15,
            },
          ]}
        >
          <Animated.View style={[checkScaleAnimation]}>
            {/* 
             // @ts-ignore */}
            <AntDesign
              name={
                item.status === ItemStatus.Done ? "checkcircle" : "checkcircleo"
              }
              style={{ color: determineBadgeTextColor() }}
              size={18}
            />
          </Animated.View>

          <Text
            adjustsFontSizeToFit={true}
            numberOfLines={2}
            style={[
              styles.listItemText,
              {
                color: determineBadgeTextColor(),
                fontFamily:
                  item.type !== ListItemType.Task ? "InterMed" : "Inter",
              },
            ]}
          >
            {item.title}
            {item.location && ` @ ${item.location}`}
          </Text>

          {item.time && (
            <View style={styles.listItemTimeSection}>
              <Vertical style={styles.diagLines} />
              <Text
                adjustsFontSizeToFit={true}
                numberOfLines={1}
                style={[
                  styles.listItemTimeText,
                  {
                    color: determineBadgeTextColor(),
                    fontFamily:
                      item.type !== ListItemType.Task ? "InterMed" : "Inter",
                  },
                ]}
              >
                {getTimeText()}
              </Text>
            </View>
          )}

          {(item.permitted_users.length > 1 ||
            item.invited_users?.length > 0) && (
            <View
              style={[
                styles.collaborativeIndicator,
                {
                  backgroundColor:
                    item.status === ItemStatus.Done ? "white" : primaryGreen,
                },
              ]}
            >
              {/* 
                // @ts-ignore */}
              <FontAwesome5
                name="users"
                size={16}
                color={item.status === ItemStatus.Done ? primaryGreen : "white"}
              />
            </View>
          )}
        </Animated.View>
        <LinearGradient
          colors={[ITEM_STATUS_TO_COLOR[ItemStatus.InProgress], "white"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={[
            {
              borderRadius: item.type !== ListItemType.Task ? 5 : 15,
            },
            styles.listHiddenBackground,
          ]}
        >
          {/* 
            // @ts-ignore */}
          <FontAwesome5 name="play" size={20} style={styles.playIcon} />
          {/* 
            // @ts-ignore */}
          <MaterialIcons name="edit" style={styles.editIcon} size={20} />
        </LinearGradient>
      </Animated.View>
    </GestureDetector>
  );
};

const styles = StyleSheet.create({
  listItem: {
    flexDirection: "row",
    width: "100%",
    padding: 10,
    height: 55,
    borderWidth: 1,
    gap: 4,
    alignItems: "center",
  },
  listItemText: {
    fontSize: 17,
    padding: 2,
    flex: 1,
  },
  listItemTimeSection: {
    minWidth: "30%",
    flexDirection: "row",
    height: "100%",
    alignItems: "center",
    marginLeft: "auto",
    justifyContent: "flex-end",
  },
  listItemTimeText: {
    padding: 2,
    marginLeft: 12,
  },
  diagLines: {
    borderColor: deepBlue,
    opacity: 0.2,
    marginLeft: 8,
    height: "200%",
    borderLeftWidth: 2,
    transform: [{ rotateZ: "-20deg" }],
  },
  listHiddenBackground: {
    height: 54,
    borderWidth: 1,
    flexDirection: "row",
    alignItems: "center",
    position: "absolute",
    width: "100%",
  },
  collaborativeIndicator: {
    borderRadius: 30,
    aspectRatio: 1,
    width: "10%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  inviteIndicator: {
    borderRadius: 50,
    aspectRatio: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 6,
  },
  playIcon: { marginLeft: 12 },
  editIcon: { marginLeft: "auto", marginRight: 11, color: "black" },
});