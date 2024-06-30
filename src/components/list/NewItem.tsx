import { useRef, useState } from 'react';
import { StyleSheet, TextInput } from 'react-native';
import { ItemType } from 'schema/database/items';

export type AddItemByTitle = (title: string) => void;

type Props = {
  addItemByTitle: AddItemByTitle;
  onBlur?: () => void;
  onFocus?: () => void;
  type: ItemType;
};

export const NewItem = ({ addItemByTitle, onBlur, onFocus, type }: Props) => {
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
      onBlur={onBlur}
      onFocus={onFocus}
      onSubmitEditing={onSubmit}
      onChangeText={onChangeText}
    />
  );
};

const styles = StyleSheet.create({
  listNewItem: {
    height: 55,
    backgroundColor: 'rgb(17 24 39)',
    fontFamily: 'Lexend',
    marginTop: 2,
    borderRadius: 10,
    paddingVertical: 8,
    paddingHorizontal: 8,
    flex: 1,
    zIndex: 10,
    borderColor: 'rgb(156 163 175)',
    borderWidth: 1,
    color: 'rgb(203 213 225)',
    fontSize: 17
  }
});
