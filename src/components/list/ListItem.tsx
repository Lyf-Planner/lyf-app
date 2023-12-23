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
import { ITEM_STATUS_TO_COLOR, ItemStatus } from "./constants";
import { useAuth } from "../../authorisation/AuthProvider";
import AntDesign from "react-native-vector-icons/AntDesign";
import * as Haptics from "expo-haptics";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { TwentyFourHourToAMPM } from "../../utils/dates";
import { ListItemDrawer } from "./ListItemDrawer";
import { useDrawer } from "../../hooks/useDrawer";

export type Item = {
  id: string;
  name: string;
  finished: boolean;
  status?: string;
};

export const ListItem = ({
  updateItem,
  item,
  removeItem,
  badgeColor,
  badgeTextColor,
  isEvent = false,
  isNote = false,
}) => {
  const { data } = useAuth();
  const { updateDrawer, updateDrawerIndex } = useDrawer();

  const openModal = () => {
    updateDrawer(
      <ListItemDrawer
        initialItem={item}
        updateRootItem={updateItem}
        removeItem={removeItem}
        isEvent={isEvent}
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

  const gestures = data.premium?.enhanced_planning_enabled
    ? Gesture.Race(tap, longPress, fling)
    : Gesture.Race(tap, longPress);

  // ANIMATION DEFINITIONS

  const scale = useSharedValue(1);
  const offsetX = useSharedValue(0);
  const willRemove = useSharedValue(false);

  var timer = null;
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
  const flickAnimation = useAnimatedStyle(
    () =>
      ({
        transform: [
          {
            translateX: withTiming(offsetX.value, {
              duration: 150,
            }),
          },
        ],
        zIndex: 50,
      } as any)
  );

  // GESTURE HANDLERS

  const handleTapIn = () => {
    scale.value = 0.95;
  };

  const handleTapOut = () => {
    scale.value = 1;
    if (item.finished)
      updateItem({ ...item, finished: false, status: ItemStatus.Upcoming });
    else {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
      updateItem({ ...item, finished: true, status: ItemStatus.Done });
    }
  };

  const handleLongPressIn = () => {
    // Start animating the shrinking of the item while user holds it down

    scale.value = 0.75;

    // After the n seconds pressing, remove the item
    timer = setInterval(() => {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
      willRemove.value = true;
      clearTimeout(timer);
    }, 400);
  };

  const handleLongPressOut = () => {
    if (willRemove.value) removeItem();

    clearTimeout(timer);
    scale.value = 1;
  };

  const handleFling = () => {
    offsetX.value = -40;

    if (data.premium?.enhanced_planning_enabled) openModal();
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

    // This makes the animation appear to pause for a second when slid back
    var closeAnimation = setInterval(() => {
      offsetX.value = 0;
      clearTimeout(closeAnimation);
    }, 200);
  };

  // STYLING

  const determineBadgeColor = () => {
    if (item.status === ItemStatus.Upcoming || !item.status) return badgeColor;
    else if (item.status === ItemStatus.Done)
      return `${ITEM_STATUS_TO_COLOR[item.status]}`;
    else return ITEM_STATUS_TO_COLOR[item.status];
  };

  const determineBadgeTextColor = () => {
    if (item.status === ItemStatus.Done) return "white";
    else return badgeTextColor;
  };

  return (
    <GestureDetector gesture={gestures}>
      <Animated.View style={scaleAnimation}>
        <Animated.View
          style={[
            styles.listItem,
            {
              backgroundColor: determineBadgeColor(),
              borderRadius: isNote || isEvent ? 5 : 15,
            },
            flickAnimation,
          ]}
        >
          <Text
            style={[
              styles.listItemText,
              {
                color: determineBadgeTextColor(),
                opacity: item.finished ? 0.8 : 1,
                fontWeight: isNote || isEvent ? "600" : "normal",
              },
            ]}
          >
            {item.name} {item.time && `${TwentyFourHourToAMPM(item.time)}`}
          </Text>

          <AntDesign
            name={item.finished ? "checkcircle" : "checkcircleo"}
            style={{ color: determineBadgeTextColor() }}
            size={16}
          />
        </Animated.View>
        <View
          style={[
            {
              borderRadius: isNote || isEvent ? 5 : 15,
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
    paddingHorizontal: 10,
    height: 45,
    borderWidth: 1,
    gap: 5,
    alignItems: "center",
  },
  listItemText: {
    fontSize: 15.5,
    paddingBottom: 1,
  },
  listHiddenBackground: {
    height: 45,
    flexDirection: "row",
    backgroundColor: "gray",
    alignItems: "center",
    position: "absolute",
    width: "100%",
  },
  editIcon: { marginLeft: "auto", marginRight: 11, color: "white" },
});
