import { useRef, useState } from "react";
import {
  StyleSheet,
  Pressable,
  View,
  Text,
  TextInput,
  Dimensions,
} from "react-native";
import Animated, {
  useSharedValue,
  withTiming,
  useAnimatedStyle,
  runOnJS,
} from "react-native-reanimated";
import {
  GestureDetector,
  Gesture,
  Directions,
} from "react-native-gesture-handler";
import AntDesign from "react-native-vector-icons/AntDesign";
import * as Haptics from "expo-haptics";
import { useScrollRef } from "../widgets/WidgetContainer";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";

type Badge = {
  name: string;
  finished: boolean;
};

const SCREEN_HEIGHT = Dimensions.get("screen").height;

export const ListInput = ({
  list,
  updateList,
  badgeColor,
  badgeTextColor = "black",
  placeholder,
  isEvents = false,
}: any) => {
  const [newItem, updateNewItem] = useState<any>("");

  const addNewItem = (item: string, finished = false) => {
    var curList = list;
    curList.push({
      name: item,
      finished,
    });
    updateList(curList);
  };

  const updateFinished = (item: Badge, finished: boolean) => {
    var curList = list;
    var i = curList.indexOf(item);
    curList[i].finished = finished;
    updateList(curList);
  };

  const removeItem = (item: Badge) => {
    console.log("removing item", item.name);
    var curList = list;
    var i = curList.indexOf(item);
    curList.splice(i, 1);
    updateList(curList);
  };

  return (
    <View style={styles.listContainer}>
      {list.map((x: Badge) => (
        <ListItem
          key={x.name}
          text={x.name}
          badgeColor={badgeColor}
          badgeTextColor={badgeTextColor}
          onRemove={() => removeItem(x)}
          finished={x.finished}
          updateFinished={(y: boolean) => updateFinished(x, y)}
          isEvent={isEvents}
        />
      ))}

      <TextInput
        returnKeyType="done"
        inputMode="text"
        placeholder={placeholder}
        placeholderTextColor="grey"
        value={newItem}
        style={styles.listNewItem}
        onSubmitEditing={() => {
          newItem && addNewItem(newItem);
          updateNewItem("");
        }}
        onChangeText={(text) => updateNewItem(text)}
      />
    </View>
  );
};

const ListItem = ({
  badgeColor,
  badgeTextColor,
  text,
  onRemove,
  finished,
  updateFinished,
  isEvent = false,
}: any) => {
  const { scrollRef } = useScrollRef();

  const tap = Gesture.Tap()
    .runOnJS(true)
    .onEnd(() => handlePressOut());
  const longPress = Gesture.LongPress()
    .runOnJS(true)
    .onStart(() => handleLongPressIn())
    .onEnd(() => handlePressOut());
  const fling = Gesture.Pan()
    .runOnJS(true)
    .onUpdate((e) => handlePan(e))
    .onEnd(() => {
      (offsetX.value = 0), (offsetY.value = 0);
    });

  const composed = Gesture.Race(tap, longPress, fling);

  const scale = useSharedValue(1);
  const offsetX = useSharedValue(0);
  const offsetY = useSharedValue(0);

  var timer = null;
  const scaleAnimation = useAnimatedStyle(() => {
    return {
      transform: [
        {
          scale: withTiming(scale.value, {
            duration: 500,
          }),
        },
      ],
    } as any;
  });
  const translateAnimation = useAnimatedStyle(
    () =>
      ({
        transform: [
          { translateX: offsetX.value },
          { translateY: offsetY.value },
        ],
        opacity: offsetX.value || offsetY.value ? 0.7 : 1,
        zIndex: 50,
        position: offsetX.value || offsetY.value ? "absolute" : "relative",
      } as any)
  );

  const handleLongPressIn = () => {
    // Start animating the shrinking of the item while user holds it down
    scale.value = 0.5;
    // After the n seconds pressing, remove the item
    timer = setInterval(() => {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
      onRemove();
      clearTimeout(timer);
    }, 400);
  };
  const handlePressOut = () => {
    updateFinished(!finished);
    !finished && Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

    clearTimeout(timer);
    scale.value = 1;
  };
  const handlePan = (e: any) => {
    offsetX.value = e.translationX;
    offsetY.value = e.translationY;
    if (e.y < 20) scrollRef.current.scrollToPosition(0, e.y - 20);
  };

  return (
    <GestureDetector gesture={composed}>
      <View>
        <Animated.View
          style={[
            styles.listItem,
            {
              backgroundColor: finished ? "rgb(21, 128, 61)" : badgeColor,
              borderRadius: isEvent ? 5 : 15,
            },
            scaleAnimation,
            translateAnimation,
          ]}
        >
          <Text
            style={{
              color: badgeTextColor,
              opacity: finished ? 0.8 : 1,
              fontWeight: isEvent ? "600" : "normal",
              fontSize: 15,
            }}
          >
            {text}
          </Text>
          {finished ? (
            <AntDesign
              name="checkcircle"
              style={{ color: badgeTextColor }}
              size={16}
            />
          ) : (
            <AntDesign
              name="checkcircleo"
              style={{ color: badgeTextColor }}
              size={16}
            />
          )}
        </Animated.View>
        <View></View>
      </View>
    </GestureDetector>
  );
};

const styles = StyleSheet.create({
  listContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    width: "100%",
    gap: 4,
    marginTop: 8,
  },
  listItem: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    paddingVertical: 10,
    paddingHorizontal: 10,
    height: 40,
    gap: 5,
    alignItems: "center",
  },
  listNewItem: {
    height: 40,
    backgroundColor: "rgb(17 24 39)",
    borderRadius: 5,
    paddingVertical: 8,
    paddingHorizontal: 8,
    minWidth: 110,
    zIndex: 10,
    borderColor: "rgb(156 163 175)",
    borderWidth: 1,
    color: "rgb(203 213 225)",
    fontSize: 15,
  },
});
