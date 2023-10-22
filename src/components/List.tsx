import { useState } from "react";
import { StyleSheet, Pressable, View, Text, TextInput } from "react-native";
import AntDesign from "react-native-vector-icons/AntDesign";

type Badge = {
  name: string;
  finished: boolean;
};

export const ListInput = ({
  list,
  updateList,
  badgeColor,
  badgeTextColor = "text-black",
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
  const handlePress = () => {
    if (finished) onRemove();
    else updateFinished(true);
  };

  return (
    <Pressable onPress={handlePress}>
      <View
        style={[
          styles.listItem,
          {
            backgroundColor: finished ? "rgb(21, 128, 61)" : badgeColor,
          },
        ]}
      >
        <Text
          style={{
            color: badgeTextColor,
            opacity: finished ? 0.8 : 1,
            fontWeight: isEvent ? "700" : "normal",
          }}
        >
          {text}
        </Text>
        {finished ? (
          <AntDesign name="checkcircle" style={{ color: badgeTextColor }} />
        ) : (
          <AntDesign name="checkcircleo" style={{ color: badgeTextColor }} />
        )}
      </View>
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
    fontSize: 15,
    borderRadius: 10,
    gap: 4,
    borderColor: "black",
    borderWidth: 1,
    alignItems: "center",
  },
  listNewItem: {
    height: 40,
    backgroundColor: "rgb(17 24 39)",
    borderRadius: 5,
    paddingVertical: 10,
    paddingHorizontal: 10,
    minWidth: 110,
    borderColor: "rgb(156 163 175)",
    borderWidth: 1,
    color: "rgb(203 213 225)",
    fontSize: 15,
  },
});
