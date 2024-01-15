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
import AntDesign from "react-native-vector-icons/AntDesign";
import * as Haptics from "expo-haptics";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { TwentyFourHourToAMPM } from "../../utils/dates";
import { ListItemDrawer } from "./ListItemDrawer";
import { useDrawer } from "../../hooks/useDrawer";
import { eventsBadgeColor, primaryGreen } from "../../utils/constants";
import { LinearGradient } from "expo-linear-gradient";

export const ListItem = ({
  item,
  updateItem,
  removeItem,
  swipeToFinish = true,
  badgeColor,
  badgeTextColor,
}) => {
  const { updateDrawer, updateDrawerIndex } = useDrawer();

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

  const gestures = swipeToFinish
    ? Gesture.Race(tap, longPress, flingLeft, flingRight)
    : Gesture.Race(tap, longPress);

  // ANIMATION DEFINITIONS

  const scale = useSharedValue(1);
  const offsetX = useSharedValue(0);

  var timer = null;
  const scaleAnimation = useAnimatedStyle(() => {
    return {
      transform: [
        {
          scale: withTiming(scale.value, {
            duration: 300,
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
              duration: 200,
            }),
          },
        ],
        zIndex: 50,
      } as any)
  );

  // GESTURE HANDLERS

  const handleTapIn = () => {
    if (item.status === ItemStatus.Upcoming) scale.value = 0.9;
    else if (item.status === ItemStatus.InProgress) scale.value = 0.7;
    else scale.value = 0.9;
    timer = setInterval(() => {
      scale.value = 1;

      clearTimeout(timer);
    }, 100);
  };

  const handleTapOut = () => {
    openModal();
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

    updateItem({ ...item, status: ItemStatus.Done });
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);

    // This makes the animation appear to pause for a second when slid back
    var closeAnimation = setInterval(() => {
      offsetX.value = 0;
      clearTimeout(closeAnimation);
    }, 400);
  };

  const handleFlingRight = () => {
    offsetX.value = 40;

    updateItem({ ...item, status: ItemStatus.Upcoming });
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

    // This makes the animation appear to pause for a second when slid back
    var closeAnimation = setInterval(() => {
      offsetX.value = 0;
      clearTimeout(closeAnimation);
    }, 400);
  };

  // STYLING

  const determineBadgeColor = () => {
    if (item.status === ItemStatus.Upcoming || !item.status) return badgeColor;
    else return ITEM_STATUS_TO_COLOR[item.status];
  };

  const determineBadgeTextColor = () => {
    if (item.status === ItemStatus.Done) return "white";
    if (item.status === ItemStatus.Tentative) return "black";
    else return badgeTextColor;
  };

  return (
    <GestureDetector gesture={gestures}>
      <Animated.View
        style={[
          scaleAnimation,
          { opacity: item.status === ItemStatus.Cancelled ? 0.7 : 1 },
        ]}
      >
        <Animated.View
          style={[
            styles.listItem,
            {
              backgroundColor: determineBadgeColor(),

              borderRadius: item.type !== ListItemType.Task ? 5 : 15,
            },
            flickAnimation,
          ]}
        >
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
            {item.title} {item.time && `${TwentyFourHourToAMPM(item.time)}`}
          </Text>

          <AntDesign
            name={
              item.status === ItemStatus.Done ? "checkcircle" : "checkcircleo"
            }
            style={{ color: determineBadgeTextColor() }}
            size={18}
          />
        </Animated.View>
        <LinearGradient
          colors={[eventsBadgeColor, primaryGreen]}
          start={[0, 1]}
          end={[1, 0]}
          style={[
            {
              borderRadius: item.type !== ListItemType.Task ? 5 : 15,
            },
            styles.listHiddenBackground,
          ]}
        >
          <MaterialIcons name="close" style={styles.unfinishIcon} size={20} />
          <MaterialIcons name="check" style={styles.finishIcon} size={20} />
        </LinearGradient>
      </Animated.View>
    </GestureDetector>
  );
};

const styles = StyleSheet.create({
  listItem: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    padding: 12,
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
    backgroundColor: primaryGreen,
    alignItems: "center",
    position: "absolute",
    width: "100%",
  },
  unfinishIcon: { marginRight: "auto", marginLeft: 11, color: "white" },
  finishIcon: { marginLeft: "auto", marginRight: 11, color: "white" },
});
