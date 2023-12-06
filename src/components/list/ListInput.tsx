import { View, StyleSheet, TextInput } from "react-native";
import { useState } from "react";
import { Item, ListItem } from "./ListItem";

import "react-native-get-random-values";
import { v4 as uuid } from "uuid";
import { useAuth } from "../../authorisation/AuthProvider";
import { ItemStatus } from "./constants";

export enum ListType {
  Event = "Event",
  Task = "Task",
  Item = "Item",
}

export const ListInput = ({
  list,
  updateList,
  badgeColor,
  badgeTextColor = "black",
  placeholder,
  listBackgroundColor = "white",
  isEvents = false,
  isNote = false,
  asColumn = false,
  listWrapperStyles = {},
  date = null,
}: any) => {
  const [newItem, updateNewItem] = useState<any>("");
  const { data } = useAuth();

  const addNewItem = (name: string, item?: any) => {
    var curList = list;

    if (!!item) curList.push(item);
    else {
      const addEventPrefs = isEvents && data.premium?.enabled;
      const prefs = addEventPrefs
        ? {
            notify: data.premium.settings?.event_notifications_enabled,
            minutes_before:
              data.premium.settings?.event_notification_minutes_before,
          }
        : {};

      curList.push({
        name,
        finished: false,
        status: ItemStatus.Upcoming,
        id: uuid(), // Precursor to migrating lists out of nesting
        date, // Precursor to migrating lists out of nesting
        ...prefs,
      });
    }
    updateList(curList);
  };

  const updateItem = (index: number, newItem: Item) => {
    var curList = list;
    curList[index] = newItem;
    updateList(curList);
  };

  const removeItem = (index: number) => {
    var curList = list;
    curList.splice(index, 1);
    updateList(curList);
  };

  return (
    <View
      style={[
        styles.listContainer,
        {
          flexDirection: asColumn ? "column" : "row",
          backgroundColor: listBackgroundColor,
        },
        listWrapperStyles,
      ]}
    >
      {list.map((x: Item, i: number) => (
        <ListItem
          key={x.id}
          badgeColor={badgeColor}
          badgeTextColor={badgeTextColor}
          item={x}
          removeItem={() => removeItem(i)}
          updateItem={(newItem: Item) => updateItem(i, newItem)}
          isEvent={isEvents}
          isNote={isNote}
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

const styles = StyleSheet.create({
  listContainer: {
    flexWrap: "wrap",
    width: "100%",
    gap: 4,
    marginTop: 6,
    padding: 1,
  },
  listNewItem: {
    height: 45,
    backgroundColor: "rgb(17 24 39)",
    borderRadius: 5,
    paddingVertical: 8,
    paddingHorizontal: 8,
    minWidth: 110,
    zIndex: 10,
    borderColor: "rgb(156 163 175)",
    borderWidth: 1,
    color: "rgb(203 213 225)",
    fontSize: 16,
  },
});
