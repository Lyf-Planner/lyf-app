import { useEffect, useRef, useState } from "react";
import { StyleSheet, View, TextInput } from "react-native";
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
import { useEditing } from "../../editor/EditorProvider";

export type Item = {
  id: string;
  name: string;
  finished: boolean;
};

export const ListItem = ({
  badgeColor,
  badgeTextColor,
  item,
  onRemove,
  updateItem,
  isEvent = false,
}: any) => {
  const [editText, updateEditText] = useState(null);
  const [newText, updateNewText] = useState(item.name);

  // EDIT MODE ACCESS

  const { editMode, updateEditMode, updateSelectedItem, selectedItem } =
    useEditing();

  const exposedEditorProps = { item, onRemove, updateEditText };

  // GESTURE DEFINITIONS

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

  // GESTURE HANDLERS

  const handleTap = () => {
    if (editMode) {
      selectedItem?.item?.name === item.name
        ? updateSelectedItem(null)
        : updateSelectedItem(exposedEditorProps);
    } else {
      updateItem({ ...item, finished: !item.finished });
      !item.finished && Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
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
    }, 500);
  };

  const handleLongPressOut = () => {
    if (willRemove.value) {
      onRemove();
    }

    clearTimeout(timer);
    scale.value = 1;
  };

  const handleFling = () => {
    offsetX.value = -30;

    var activate = setInterval(() => {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      updateEditMode(true);

      // This makes the animation appear to pause for a second when slid back
      var closeAnimation = setInterval(() => {
        offsetX.value = 0;
        clearTimeout(closeAnimation);
      }, 200);

      clearTimeout(activate);
    }, 200);
  };

  // EDIT TEXT HELPERS

  const textRef = useRef<any>();
  useEffect(() => {
    if (editText) {
      selectedItem?.item !== item && updateEditText(false);
      textRef.current.focus();
    }
  }, [selectedItem, editText]);

  const submitTextEdit = () => {
    // Stop editing - push the change
    updateItem({ ...item, name: newText });
    updateSelectedItem(null);
    updateEditText(false);
  };

  return (
    <GestureDetector gesture={composed}>
      <Animated.View style={scaleAnimation}>
        <Animated.View
          style={[
            styles.listItem,
            {
              backgroundColor: item.finished ? "rgb(21, 128, 61)" : badgeColor,
              borderRadius: isEvent ? 5 : 15,
              borderColor:
                selectedItem?.item?.name === item.name ? "red" : "black",
            },
            flickAnimation,
          ]}
        >
          <TextInput
            ref={textRef}
            style={[
              styles.listItemText,
              {
                color: badgeTextColor,
                opacity: item.finished ? 0.8 : 1,
                fontWeight: isEvent ? "600" : "normal",
              },
            ]}
            value={newText}
            returnKeyType="done"
            selectionColor={item.finished ? "white" : "rgb(21, 128, 61)"}
            editable={!!editText}
            selectTextOnFocus={!!editText}
            onSubmitEditing={submitTextEdit}
            onChangeText={updateNewText}
          />

          <AntDesign
            name={item.finished ? "checkcircle" : "checkcircleo"}
            style={{ color: badgeTextColor }}
            size={16}
          />
        </Animated.View>
        <View
          style={[
            {
              borderRadius: isEvent ? 5 : 15,
              backgroundColor: editMode ? "red" : "gray",
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
    alignItems: "center",
    position: "absolute",
    width: "100%",
  },
  editIcon: { marginLeft: "auto", marginRight: 7 },
});
