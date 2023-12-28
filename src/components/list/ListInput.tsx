import { View, StyleSheet, TextInput } from "react-native";
import { useRef, useState } from "react";
import { ListItem } from "./ListItem";
import { Loader } from "../MiscComponents";
import { useItems } from "../../hooks/useItems";

export enum ListType {
  Event = "Event",
  Task = "Task",
  Item = "Item",
}

export const ListInput = ({
  items,
  type,
  dateData,
  badgeColor,
  badgeTextColor = "black",
  listBackgroundColor = "white",
  listWrapperStyles = {},
  template = false,
}: any) => {
  const [newItem, updateNewItem] = useState<any>("");
  const [addingItem, updateAddingItem] = useState(false);
  const { addItem } = useItems();

  const inputRef = useRef<TextInput>(null);

  const addNewItem = (name: string) => {
    // Create in items
    updateAddingItem(true);
    var dateArg, dayArg;
    if (template) {
      dateArg = null;
      dayArg = dateData.day;
    } else {
      dateArg = dateData.date;
      dayArg = dateData.day;
    }

    addItem(name, type, dateArg, dayArg).then(() => updateAddingItem(false));
  };

  return (
    <View
      style={[
        styles.listContainer,
        {
          flexDirection: "row",
          backgroundColor: listBackgroundColor,
        },
        listWrapperStyles,
      ]}
    >
      {items.map((x: any, i: number) => (
        <ListItem
          key={x.id}
          type={type}
          badgeColor={badgeColor}
          badgeTextColor={badgeTextColor}
          item={x}
        />
      ))}

      {addingItem ? (
        <View style={styles.loaderContainer}>
          <Loader color={"white"} size={20} />
        </View>
      ) : (
        <TextInput
          returnKeyType="done"
          ref={inputRef}
          inputMode="text"
          placeholder={`Add ${type} +`}
          placeholderTextColor="grey"
          value={newItem}
          style={styles.listNewItem}
          blurOnSubmit={false}
          onSubmitEditing={() => {
            newItem && addNewItem(newItem);
            updateNewItem("");
            inputRef.current.focus();
          }}
          onChangeText={(text) => updateNewItem(text)}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  listContainer: {
    flexWrap: "wrap",
    width: "100%",
    gap: 4,
    marginTop: 6,
    padding: 1,
  },
  loaderContainer: {
    height: 50,
    backgroundColor: "rgb(17 24 39)",
    width: 120,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    borderColor: "rgb(156 163 175)",
    borderWidth: 1,
    borderRadius: 5,
  },
  listNewItem: {
    height: 50,
    backgroundColor: "rgb(17 24 39)",
    borderRadius: 5,
    paddingVertical: 8,
    paddingHorizontal: 8,
    width: 120,
    zIndex: 10,
    borderColor: "rgb(156 163 175)",
    borderWidth: 1,
    color: "rgb(203 213 225)",
    fontSize: 16,
  },
});
