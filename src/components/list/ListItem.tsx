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
import { useItems } from "../../hooks/useItems";
import { useState } from "react";

export const ListItem = ({
  item,
  updateItem,
  removeItem,
  badgeColor,
  badgeTextColor,
}) => {
  const { updateDrawer, updateDrawerIndex } = useDrawer();

  const openModal = () => {
    updateDrawer(
      <ListItemDrawer
        initialItem={item}
        updateRootItem={updateItem}
        removeItem={() => removeItem(item)}
        type={item.type}
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
  const fling = Gesture.Fling()
    .direction(Directions.LEFT)
    .runOnJS(true)
    .onEnd(() => handleFling());

  const gestures = Gesture.Race(tap, longPress, fling);

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
    if (item.status === ItemStatus.InProgress) scale.value = 0.8;
    else scale.value = 0.9;
  };

  const handleTapOut = () => {
    if (item.status === ItemStatus.Done)
      updateItem({ ...item, status: ItemStatus.Upcoming });
    else {
      updateItem({ ...item, status: ItemStatus.Done });
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    }

    scale.value = 1;
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

  const handleFling = () => {
    offsetX.value = -40;

    // Will soon make this a feature available to all
    openModal();
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
                fontWeight: item.type !== ListItemType.Task ? "600" : "normal",
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
            size={16}
          />
        </Animated.View>
        <View
          style={[
            {
              borderRadius: item.type !== ListItemType.Task ? 5 : 15,
            },
            styles.listHiddenBackground,
          ]}
        >
          <MaterialIcons name="edit" style={styles.editIcon} size={20} />
        </View>
      </Animated.View>
    </GestureDetector>
  );
};

const styles = StyleSheet.create({
  listItem: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    paddingVertical: 10,
    paddingHorizontal: 12,
    height: 50,
    borderWidth: 1,
    gap: 4,
    alignItems: "center",
  },
  listItemText: {
    fontSize: 16,
    paddingBottom: 1,
  },
  listHiddenBackground: {
    height: 49,
    borderWidth: 1,
    flexDirection: "row",
    backgroundColor: "white",
    alignItems: "center",
    position: "absolute",
    width: "100%",
  },
  editIcon: { marginLeft: "auto", marginRight: 11, color: "black" },
});
