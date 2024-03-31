import { View, StyleSheet, TextInput } from "react-native";
import { useEffect, useRef, useState } from "react";
import { ListItem } from "./item/ListItem";
import { NestableDraggableFlatList } from "react-native-draggable-flatlist";
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
  const { resortItems } = useItems();

  return (
    <View style={{ gap: 2 }}>
      <NestableDraggableFlatList
        containerStyle={[
          styles.listContainer,
          {
            backgroundColor: listBackgroundColor,
          },
          listWrapperStyles,
        ]}
        style={styles.flatlistInternal}
        data={items}
        onDragEnd={({ data }) => {
          resortItems(data.map((x) => x.id));
        }}
        keyExtractor={(item: any) => item.id}
        renderItem={(x: any) => {
          return (
            <ListItem
              key={x.item.template_id || x.item.id}
              updateItem={updateItem}
              badgeColor={badgeColor}
              fromNote={fromNote}
              badgeTextColor={badgeTextColor}
              item={x.item}
              dragFunc={x.drag}
              isActive={x.isActive}
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
    flexDirection: "row",
    overflow: "visible",
    width: "100%",
    gap: 4,
    marginTop: 4,
    padding: 2,
  },
  flatlistInternal: { overflow: "visible" },
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
