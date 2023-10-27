import { useEffect, useRef, useState } from "react";
import { StyleSheet, Pressable, View, Text, TextInput } from "react-native";
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
import AntDesign from "react-native-vector-icons/AntDesign";
import * as Haptics from "expo-haptics";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { useEditing } from "../widgets/timetable/TimetableEditor";
import Math from "math";

type Item = {
  name: string;
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

  const exposedEditorProps = {
    addNewItem,
    list,
  };

  // Editor access
  const { editMode, updateSelectedList, selectedList } = useEditing();

  return (
    <Pressable
      disabled={!editMode}
      onPress={() => {
        console.log("pressed");
        selectedList?.list !== list
          ? updateSelectedList(exposedEditorProps)
          : updateSelectedList(null);
      }}
    >
      <View
        style={[
          styles.listContainer,
          selectedList?.list === list && {
            borderColor: "red",
            borderWidth: 1,
            borderRadius: 5,
          },
        ]}
      >
        {list.map((x: Item) => (
          <ListItem
            key={x.name}
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
            newItem && addNewItem({ name: newItem, finished: false });
            updateNewItem("");
          }}
          onChangeText={(text) => updateNewItem(text)}
        />
      </View>
    </Pressable>
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
  const [newText, updateNewText] = useState(item.name);

  // Edit access
  const { editMode, updateEditMode, updateSelectedItem, selectedItem } =
    useEditing();

  // Actions
  const tap = Gesture.Tap()
    .runOnJS(true)
    .onEnd(() => handleTap());
  const longPress = Gesture.LongPress()
    .runOnJS(true)
    .onStart(() => handleLongPressIn())
    .onEnd(() => handleLongPressOut());
  const fling = Gesture.Fling()
    .direction(Directions.LEFT)
    .runOnJS(true)
    .onEnd(() => handleFling());

  const composed = Gesture.Exclusive(tap, longPress, fling);

  // Animations
  const scale = useSharedValue(1);
  const offsetX = useSharedValue(0);
  const willRemove = useSharedValue(false);

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

  // Action handlers
  const handleLongPressIn = () => {
    // Start animating the shrinking of the item while user holds it down
    scale.value = 1.1;

    // After the n seconds pressing, remove the item
    timer = setInterval(() => {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
      willRemove.value = true;
      clearTimeout(timer);
    }, 500);
  };
  const handleLongPressOut = () => {
    if (willRemove.value) {
      onRemove();
    }

    clearTimeout(timer);
    scale.value = 1;
  };
  const handleTap = () => {
    if (editMode) {
      selectedItem?.item?.name === item.name
        ? updateSelectedItem(null)
        : updateSelectedItem({ ...props, updateEditText });
    } else {
      updateItem({ ...item, finished: !item.finished });
      !item.finished && Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
  };

  const handleFling = () => {
    offsetX.value = -30;

    var activate = setInterval(() => {
      console.log("running interval");
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      updateEditMode(true);
      var closeAnimation = setInterval(() => {
        offsetX.value = 0;
        clearTimeout(closeAnimation);
      }, 200);
      clearTimeout(activate);
    }, 200);
  };

  // Edit text operation
  const textRef = useRef<any>();
  useEffect(() => {
    if (editText) selectedItem.item !== item && updateEditText(false);
    if (editText) textRef.current.focus();
  }, [selectedItem, editText]);

  return (
    <GestureDetector gesture={composed}>
      <View>
        <Animated.View
          style={[
            styles.listItem,
            {
              backgroundColor: item.finished ? "rgb(21, 128, 61)" : badgeColor,
              borderRadius: isEvent ? 5 : 15,
              borderColor:
                selectedItem?.item?.name === item.name ? "red" : "black",
            },
            scaleAnimation,
            flickAnimation,
          ]}
        >
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
            returnKeyType="done"
            editable={!!editText}
            selectTextOnFocus={!!editText}
            onSubmitEditing={() => {
              // Stop editing - push the change
              updateItem({ ...item, name: newText });
              updateEditText(false);
              updateNewText("");
            }}
            onChangeText={(text) => updateNewText(text)}
          />

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
        <View
          style={[
            {
              position: "absolute",
              width: "100%",
              borderRadius: isEvent ? 5 : 15,
              height: 40,
              flexDirection: "row",
              alignItems: "center",
              backgroundColor: editMode ? "red" : "gray",
            },
          ]}
        >
          <MaterialIcons
            name="edit"
            style={{ marginLeft: "auto", marginRight: 7 }}
            size={20}
          />
        </View>
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
