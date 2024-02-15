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
import { ITEM_STATUS_TO_COLOR, ItemStatus, ListItemType } from "./constants";
import { TwentyFourHourToAMPM } from "../../utils/dates";
import { ListItemDrawer } from "./ListItemDrawer";
import { useDrawer } from "../../hooks/useDrawer";
import { LinearGradient } from "expo-linear-gradient";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import AntDesign from "react-native-vector-icons/AntDesign";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import * as Haptics from "expo-haptics";
import { primaryGreen, sleep } from "../../utils/constants";
import { useCallback, useMemo } from "react";
import { useAuth } from "../../authorisation/AuthProvider";

const SCALE_MS = 180;

export const ListItem = ({
  item,
  updateItem,
  removeItem,
  badgeColor,
  badgeTextColor,
}) => {
  const { updateDrawer, updateDrawerIndex } = useDrawer();
  const { user } = useAuth();
  const invited = useMemo(
    () =>
      item.invited_users &&
      !!item.invited_users.find((x) => x.user_id === user.id),
    [item.invited_users, user]
  );

  const openModal = () => {
    updateDrawer(null);
    updateDrawer(
      <ListItemDrawer
        initialItem={item}
        updateRootItem={updateItem}
        removeItem={() => removeItem(item)}
        closeModal={() => updateDrawer(null)}
        updateDrawerIndex={updateDrawerIndex}
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
    const markingAsDone = item.status !== ItemStatus.Done;
    scale.value = markingAsDone ? 0.7 : 0.9;
    await sleep(SCALE_MS);

    scale.value = markingAsDone ? 1.1 : 1;
    await sleep(SCALE_MS);

    scale.value = 1;
    checkScale.value = markingAsDone ? 1.5 : 1;
    await sleep(SCALE_MS);

    checkScale.value = 1;
  }, [item.status]);

  const handleTapOut = () => {
    if (item.status === ItemStatus.Done) {
      updateItem({ ...item, status: ItemStatus.Upcoming });
    } else {
      updateItem({ ...item, status: ItemStatus.Done });
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    }
  };

  const handleLongPressIn = () => {
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
    else return badgeTextColor;
  };

  return (
    <GestureDetector gesture={gestures}>
      <Animated.View
        style={[
          scaleAnimation,
          {
            opacity: item.status === ItemStatus.Cancelled ? 0.7 : 1,
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
          {item.permitted_users.length > 1 && (
            <View
              style={[
                styles.collaborativeIndicator,
                {
                  backgroundColor:
                    item.status === ItemStatus.Done ? "white" : primaryGreen,
                },
              ]}
            >
              <FontAwesome5
                name="users"
                size={16}
                color={item.status === ItemStatus.Done ? primaryGreen : "white"}
              />
            </View>
          )}
          {invited && (
            <View
              style={[
                styles.inviteIndicator,
                {
                  backgroundColor:
                    item.status === ItemStatus.Done ? "white" : primaryGreen,
                },
              ]}
            >
              <FontAwesome5
                name="plus"
                size={16}
                color={item.status === ItemStatus.Done ? primaryGreen : "white"}
              />
            </View>
          )}

          <Text
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
            {item.time && ` ${TwentyFourHourToAMPM(item.time)}`}
          </Text>

          <Animated.View style={[checkScaleAnimation]}>
            <AntDesign
              name={
                item.status === ItemStatus.Done ? "checkcircle" : "checkcircleo"
              }
              style={{ color: determineBadgeTextColor() }}
              size={18}
            />
          </Animated.View>
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
          <FontAwesome5 name="play" size={20} style={styles.playIcon} />
          <MaterialIcons name="edit" style={styles.editIcon} size={20} />
        </LinearGradient>
      </Animated.View>
    </GestureDetector>
  );
};

const styles = StyleSheet.create({
  listItem: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    padding: 10,
    height: 55,
    borderWidth: 1,
    gap: 4,
    alignItems: "center",
  },
  listItemText: {
    fontSize: 17,
    padding: 2,
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
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 4,
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
