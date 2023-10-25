import { useEffect, useRef, useState } from "react";
import {
  StyleSheet,
  Pressable,
  View,
  Text,
  TextInput,
  Animated,
  Easing,
} from "react-native";
import AntDesign from "react-native-vector-icons/AntDesign";
import * as Haptics from "expo-haptics";
import { useEditing } from "../widgets/timetable/TimetableEditor";

type Badge = {
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

const ListItem = (props: any) => {
  const {
    badgeColor,
    badgeTextColor,
    text,
    onRemove,
    finished,
    updateFinished,
    isEvent = false,
  } = props;
  const { editMode, updateEditMode, updateSelectedItem, selectedItem } =
    useEditing();

  const sizeScale = new Animated.Value(1);
  var timer = null;
  var minifyAnimation = Animated.timing(sizeScale, {
    toValue: 0.7,
    duration: 600,
    useNativeDriver: true,
  });

  const handlePressIn = () => {
    // Start animating the shrinking of the item while user holds it down
    minifyAnimation.start();
    // After the n seconds pressing, remove the item
    timer = setInterval(() => {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
      updateEditMode(true);
      clearTimeout(timer);
    }, 500);
  };

  const handlePressOut = () => {
    if (editMode) {
      selectedItem?.text === text
        ? updateSelectedItem(null)
        : updateSelectedItem(props);
    } else {
      updateFinished(!finished);
    }
    (!finished || editMode) &&
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    minifyAnimation.stop();
    clearTimeout(timer);
    sizeScale.setValue(1);
  };

  return (
    <Pressable
      onLongPress={handlePressIn}
      delayLongPress={250}
      onPressOut={handlePressOut}
    >
      <Animated.View
        style={[
          styles.listItem,
          {
            backgroundColor: finished ? "rgb(21, 128, 61)" : badgeColor,
            borderRadius: isEvent ? 5 : 15,
            transform: [{ scale: sizeScale }],
          },
          selectedItem?.text === text && {
            borderColor: "red",
          },
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
    </Pressable>
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
    zIndex: 20,
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
