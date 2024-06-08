import { useState } from 'react';
import { StyleSheet, TextInput } from 'react-native';

export const ItemTitle = ({ item, updateItem, updateSheetMinHeight, invited }) => {
  const [title, setTitle] = useState(item.title);

  const updateTitle = (title) => updateItem({ ...item, title });

  return (
    <TextInput
      value={title}
      onChangeText={!invited && setTitle}
      style={styles.itemTitle}
      onFocus={() => updateSheetMinHeight(500)}
      onBlur={() => {
        updateSheetMinHeight(100);
        !invited && updateTitle(title);
      }}
      returnKeyType="done"
    />
  );
};

const styles = StyleSheet.create({
  itemTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: 'white',
    flex: 1
  }
});
