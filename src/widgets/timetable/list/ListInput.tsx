import { View, Pressable, StyleSheet, TextInput } from "react-native";
import { useState } from "react";
import { Item, ListItem } from "./ListItem";
import { useEditing } from "../editor/EditorProvider";

export const ListInput = ({
  list,
  updateList,
  badgeColor,
  badgeTextColor = "black",
  placeholder,
  listBackgroundColor = "white",
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
          {
            borderColor:
              selectedList?.list === list ? "red" : listBackgroundColor,
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

const styles = StyleSheet.create({
  listContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    width: "100%",
    gap: 4,
    marginTop: 6,
    borderWidth: 1,
    borderRadius: 5,
    padding: 2
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
