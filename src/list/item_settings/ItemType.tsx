import { StyleSheet, TouchableHighlight, Text } from "react-native";
import { ListItemType } from "../constants";
import { eventsBadgeColor } from "../../utils/constants";

export const ItemType = ({ item, updateItem }) => {
  const switchType = () => {
    var newItem = { ...item };
    if (item.type === ListItemType.Task) {
      newItem.type = ListItemType.Event;
    } else {
      newItem.type = ListItemType.Task;
    }

    updateItem(newItem);
  };

  return (
    <TouchableHighlight
      style={[
        styles.typeBadge,
        {
          backgroundColor:
            item.type === ListItemType.Event ? eventsBadgeColor : "white",
        },
      ]}
      onPress={switchType}
      underlayColor={"rgba(0,0,0,0.5)"}
    >
      <Text style={styles.typeText}>{item.type}</Text>
    </TouchableHighlight>
  );
};

const styles = StyleSheet.create({
  typeBadge: {
    marginLeft: "auto",
    paddingVertical: 6,
    paddingHorizontal: 8,
    borderRadius: 10,
  },
  typeText: {
    fontSize: 16,
    fontWeight: "500"
  },
});
