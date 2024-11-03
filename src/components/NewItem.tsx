import { useRef, useState } from 'react';
import { Platform, StyleSheet, TextInput } from 'react-native';
import { ItemType } from 'schema/database/items';
import { inProgressColor } from 'utils/colours';

export type AddItemByTitle = (title: string) => void;

type Props = {
  addItemByTitle: AddItemByTitle;
  onBlur?: () => void;
  onFocus?: () => void;
  type: ItemType;
  whiteShadow?: boolean;
};

export const NewItem = ({ addItemByTitle, onBlur, onFocus, type, whiteShadow = true }: Props) => {
  const [newItem, updateNewItem] = useState<string>('');
  const inputRef = useRef<TextInput>(null);
  const placeholderText = `+ Add ${type}`;

  const onSubmit = () => {
    newItem && addItemByTitle(newItem);
    inputRef.current?.clear();
    inputRef.current?.focus();
  };

  const onChangeText = (text: string) => updateNewItem(text);

  const conditionalStyles = {
    listNewItem: whiteShadow && Platform.OS !== 'web' ? {
      shadowOffset: { width: 0, height: 0 },
      shadowColor: 'white',
      shadowOpacity: 1,
      shadowRadius: 1
    } : {}
  }

  return (
    <TextInput
      ref={inputRef}
      returnKeyType="done"
      placeholder={placeholderText}
      placeholderTextColor={inProgressColor}
      style={[styles.listNewItem, conditionalStyles.listNewItem]}
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
    minHeight: 50,
    height: 50,
    width: '100%',
    backgroundColor: 'rgb(17 24 39)',
    fontFamily: 'Lexend',
    marginTop: 2,
    borderRadius: 10,
    paddingVertical: 8,
    paddingLeft: 8,
    flex: 1,
    zIndex: 10,
    color: 'rgb(203 213 225)',
    fontSize: 16,
  }
});
