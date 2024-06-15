import { useRef, useState } from 'react';
import { StyleSheet, TextInput } from 'react-native';
import { LIST_ITEM_HEIGHT } from './item/Item';
import { ItemType } from 'schema/database/items';

export type AddItemByTitle = (title: string) => void;

type Props = {
  type: ItemType;
  addItemByTitle: AddItemByTitle;
};

export const NewItem = ({ type, addItemByTitle }: Props) => {
  const [newItem, updateNewItem] = useState<string>('');
  const inputRef = useRef<TextInput>(null);
  const placeholderText = `Add ${type} +`;

  const onSubmit = () => {
    newItem && addItemByTitle(newItem);
    inputRef.current?.clear();
    inputRef.current?.focus();
  };

  const onChangeText = (text: string) => updateNewItem(text);

  return (
    <TextInput
      ref={inputRef}
      returnKeyType="done"
      placeholder={placeholderText}
      placeholderTextColor="grey"
      style={styles.listNewItem}
      blurOnSubmit={false}
      onSubmitEditing={onSubmit}
      onChangeText={onChangeText}
    />
  );
};

const styles = StyleSheet.create({
  listNewItem: {
    height: LIST_ITEM_HEIGHT,
    backgroundColor: 'rgb(17 24 39)',
    fontFamily: 'Inter',
    marginTop: 2,
    borderRadius: 10,
    paddingVertical: 8,
    paddingHorizontal: 8,
    width: '100%',
    zIndex: 10,
    borderColor: 'rgb(156 163 175)',
    borderWidth: 1,
    color: 'rgb(203 213 225)',
    fontSize: 17
  }
});
