import { useState } from 'react';
import { StyleSheet, TextInput } from 'react-native';
import { ItemDrawerProps } from '../ItemDrawer';

export const ItemTitle = ({ item, updateItem, updateSheetMinHeight }: ItemDrawerProps) => {
  const [title, setTitle] = useState(item.title);

  const updateTitle = (title: string) => updateItem(item, { title });

  return (
    <TextInput
      value={title}
      onChangeText={!item.invite_pending ? setTitle : undefined}
      style={styles.itemTitle}
      onFocus={() => updateSheetMinHeight(500)}
      onBlur={() => {
        updateSheetMinHeight(100);
        
        if (!item.invite_pending) {
          updateTitle(title);
        } 
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
    flex: 1,
  }
});
