import { useState } from "react";
import { StyleSheet, TextInput } from "react-native";

export const ItemTitle = ({ item, updateItem, updateDrawerIndex, invited }) => {
  const [title, setTitle] = useState(item.title);

  const updateTitle = (title) => updateItem({ ...item, title });

  return (
    <TextInput
      value={title}
      onChangeText={!invited && setTitle}
      style={styles.itemTitle}
      onFocus={() => updateDrawerIndex(1)}
      onBlur={() => {
        !item.desc && updateDrawerIndex(0);
        !invited && updateTitle(title);
      }}
      returnKeyType="done"
    />
  );
};

const styles = StyleSheet.create({
  itemTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "white",
    flex: 1,
  },
});
