import { useEffect, useRef, useState } from "react";
import { StyleSheet, Pressable, View, Text, TextInput } from "react-native";
import Animated, {
  useSharedValue,
  withTiming,
  useAnimatedStyle,
  runOnJS,
  processColor,
} from "react-native-reanimated";
import {
  GestureDetector,
  Gesture,
  Directions,
} from "react-native-gesture-handler";
import AntDesign from "react-native-vector-icons/AntDesign";
import * as Haptics from "expo-haptics";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { useEditing } from "../widgets/timetable/TimetableEditor";
import Math from "math";

type Item = {
  text: string;
  finished: boolean;
};

export const ListInput = ({
  list,
  updateList,
  badgeColor,
  badgeTextColor = "black",
  placeholder,
  isEvents = false,
}: any) => {
  const [newItem, updateNewItem] = useState<any>("");

  const addNewItem = (item: Item) => {
    var curList = list;
    curList.push(item);
    updateList(curList);
  };

  const updateItem = (oldItem: Item, newItem: Item) => {
    var curList = list;
    var i = curList.indexOf(oldItem);
    curList[i] = newItem;
    updateList(curList);
  };

  const removeItem = (item: Item) => {
    var curList = list;
    var i = curList.indexOf(item);
    curList.splice(i, 1);
    updateList(curList);
  };

  return (
    <View style={styles.listContainer}>
      {list.map((x: Item) => (
        <ListItem
          key={x.text}
          badgeColor={badgeColor}
          badgeTextColor={badgeTextColor}
          item={x}
          onRemove={() => removeItem(x)}
          updateItem={(newItem: Item) => updateItem(x, newItem)}
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

const ListItem = (props: any) => {
  const {
    badgeColor,
    badgeTextColor,
    item,
    onRemove,
    updateItem,
    isEvent = false,
  } = props;
  const [editText, updateEditText] = useState(null);
  const [newText, updateNewText] = useState(null);

  // Edit access
  const { editMode, updateEditMode, updateSelectedItem, selectedItem } =
    useEditing();

  // Actions
  const tap = Gesture.Tap()
    .runOnJS(true)
    .onEnd(() => handlePressOut());
  const longPress = Gesture.LongPress()
    .runOnJS(true)
    .onStart(() => handleLongPressIn())
    .onEnd(() => handlePressOut());
  const pan = Gesture.Pan()
    .runOnJS(true)
    .onUpdate((e) => handlePan(e))
    .onEnd(() => handlePanRelease());

  const composed = Gesture.Exclusive(tap, longPress, pan);

  // Animations
  const scale = useSharedValue(1);
  const offsetX = useSharedValue(0);
  const offsetY = useSharedValue(0);
  const willRemove = useSharedValue(false);

  var timer = null;
  var hitMinusThirty = false;
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
  const flickAnimation = useAnimatedStyle(
    () =>
      ({
        transform: [
          { translateX: offsetX.value },
          { translateY: offsetY.value },
        ],
        zIndex: 50,
      } as any)
  );
  const backgroundAnimation = useAnimatedStyle(
    () =>
      ({
        backgroundColor: offsetX.value === -30 ? "red" : "gray",
      } as any)
  );

  // Action handlers
  const handleLongPressIn = () => {
    console.log("handling long press");
    // Start animating the shrinking of the item while user holds it down
    scale.value = 1.1;

    // After the n seconds pressing, remove the item
    timer = setInterval(() => {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
      willRemove.value = true;
      clearTimeout(timer);
    }, 500);
  };
  const handlePressOut = () => {
    if (editMode) {
      selectedItem?.text === item.text
        ? updateSelectedItem(null)
        : updateSelectedItem({ ...props, editTextAndFocus });
    } else if (willRemove.value && !editMode) {
      onRemove();
    } else {
      updateItem({ ...item, finished: !item.finished });
    }

    (!item.finished || editMode) &&
      !willRemove &&
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

    clearTimeout(timer);
    scale.value = 1;
  };
  const handlePan = (e: any) => {
    offsetX.value = Math.max(Math.min(0, e.translationX), -30);
    if (offsetX.value > -30) hitMinusThirty = false;
    if (offsetX.value <= -30 && !hitMinusThirty) {
      hitMinusThirty = true;
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
  };
  const handlePanRelease = () => {
    if (offsetX.value === -30) updateEditMode(true);
    offsetX.value = 0;
  };

  // Edit text operation
  const textRef = useRef(null);
  const editTextAndFocus = () => {
    updateEditMode(true);
    textRef.current.focus();
  };

  return (
    <GestureDetector gesture={composed}>
      <View>
        <Animated.View
          style={[
            styles.listItem,
            {
              backgroundColor: item.finished ? "rgb(21, 128, 61)" : badgeColor,
              borderRadius: isEvent ? 5 : 15,
              borderColor: selectedItem?.text === item.text ? "red" : "black",
            },
            scaleAnimation,
            flickAnimation,
          ]}
        >
          {editText ? (
            <TextInput
              ref={textRef}
              style={{
                color: badgeTextColor,
                opacity: item.finished ? 0.8 : 1,
                fontWeight: isEvent ? "600" : "normal",
                fontSize: 15,
                paddingBottom: 1,
              }}
              value={newText}
              onSubmitEditing={() => {
                // Stop editing - push the change
                updateItem({ ...item, text: newText });
                updateNewText("");
              }}
              onChangeText={(text) => updateNewText(text)}
            />
          ) : (
            <Text
              style={{
                color: badgeTextColor,
                opacity: item.finished ? 0.8 : 1,
                fontWeight: isEvent ? "600" : "normal",
                fontSize: 15,
              }}
            >
              {item.text}
            </Text>
          )}
          {item.finished ? (
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
        <Animated.View
          style={[
            {
              position: "absolute",
              width: "100%",
              borderRadius: isEvent ? 5 : 15,
              height: 40,
              flexDirection: "row",
              alignItems: "center",
            },
            backgroundAnimation,
          ]}
        >
          <MaterialIcons
            name="edit"
            style={{ marginLeft: "auto", marginRight: 7 }}
            size={20}
          />
        </Animated.View>
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
    borderWidth: 1,
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
