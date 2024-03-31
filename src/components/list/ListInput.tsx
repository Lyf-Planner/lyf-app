import { View, StyleSheet, TextInput } from "react-native";
import { useRef, useState } from "react";
import { ListItem } from "./item/ListItem";

export enum ListType {
  Event = "Event",
  Task = "Task",
  Item = "Item",
}

export const ListInput = ({
  items,
  addItem,
  updateItem,
  removeItem,
  type,
  badgeColor,
  badgeTextColor = "black",
  listBackgroundColor = "white",
  listWrapperStyles = {},
  fromNote = false,
}) => {
  return (
    <View
      style={[
        styles.listContainer,
        {
          backgroundColor: listBackgroundColor,
        },
        listWrapperStyles,
      ]}
    >
      {items.map((x, i: number) => (
        <ListItem
          key={x.template_id || x.id}
          updateItem={updateItem}
          removeItem={removeItem}
          badgeColor={badgeColor}
          fromNote={fromNote}
          badgeTextColor={badgeTextColor}
          item={x}
        />
      ))}
      <NewItem type={type} addItem={addItem} />
    </View>
  );
};

const NewItem = ({ type, addItem }) => {
  const [newItem, updateNewItem] = useState<any>("");

  const inputRef = useRef<any>();

  return (
    <TextInput
      ref={inputRef}
      returnKeyType="done"
      placeholder={`Add ${type} +`}
      placeholderTextColor="grey"
      style={styles.listNewItem}
      blurOnSubmit={false}
      onSubmitEditing={() => {
        newItem && addItem(newItem);
        inputRef.current.clear();
        inputRef.current.focus();
      }}
      onChangeText={(text) => updateNewItem(text)}
    />
  );
};

const styles = StyleSheet.create({
  listContainer: {
    flexWrap: "wrap",
    flexDirection: "row",
    width: "100%",
    marginTop: 6,
    padding: 2,
  },
  listNewItem: {
    height: 55,
    backgroundColor: "rgb(17 24 39)",
    fontFamily: "Inter",
    marginTop: 4,
    borderRadius: 10,
    paddingVertical: 8,
    paddingHorizontal: 8,
    width: "100%",
    zIndex: 10,
    borderColor: "rgb(156 163 175)",
    borderWidth: 1,
    color: "rgb(203 213 225)",
    fontSize: 17,
  },
});
