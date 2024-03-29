import { View, StyleSheet, TextInput } from "react-native";
import { useEffect, useRef, useState } from "react";
import { ListItem } from "./ListItem";
import DraggableFlatList from "react-native-draggable-flatlist";
import { useItems } from "../../hooks/useItems";

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
  const [localItems, setLocalItems] = useState(items);
  const { resortItems } = useItems();

  useEffect(() => {
    setLocalItems(items);
  }, [items]);

  console.log(
    "items refreshed as",
    items.map((x) => x.id)
  );

  return (
    <View style={{ gap: 2 }}>
      <DraggableFlatList
        containerStyle={[
          styles.listContainer,
          {
            flexDirection: "row",
            backgroundColor: listBackgroundColor,
          },
          listWrapperStyles,
        ]}
        data={localItems}
        onDragEnd={({ data }) => {
          resortItems(data.map((x) => x.id))
          setLocalItems(data);
        }}
        keyExtractor={(item: any, index: number) => item.id + "-" + index}
        renderItem={(x: any) => {
          return (
            <ListItem
              key={x.item.template_id || x.item.id}
              updateItem={updateItem}
              removeItem={removeItem}
              badgeColor={badgeColor}
              fromNote={fromNote}
              badgeTextColor={badgeTextColor}
              item={x.item}
              dragFunc={x.drag}
            />
          );
        }}
      />
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
    width: "100%",
    gap: 4,
    marginTop: 4,
    padding: 2,
  },
  listNewItem: {
    height: 55,
    backgroundColor: "rgb(17 24 39)",
    fontFamily: "Inter",
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
