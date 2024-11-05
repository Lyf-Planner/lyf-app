import { useRef, useState } from 'react';
import { Platform, StyleSheet, TextInput } from 'react-native';

import { ItemType } from 'schema/database/items';
import { inProgressColor, listNewItemBackground, listNewItemText, white } from 'utils/colours';

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
    if (newItem) {
      addItemByTitle(newItem);
    }
    inputRef.current?.clear();
    inputRef.current?.focus();
  };

  const onChangeText = (text: string) => updateNewItem(text);

  const conditionalStyles = {
    listNewItem: whiteShadow && Platform.OS !== 'web' ? {
      shadowOffset: { width: 0, height: 0 },
      shadowColor: white,
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
    backgroundColor: listNewItemBackground,
    borderRadius: 10,
    color: listNewItemText,
    flex: 1,
    fontFamily: 'Lexend',
    fontSize: 16,
    height: 50,
    marginTop: 2,
    minHeight: 50,
    paddingLeft: 8,
    paddingVertical: 8,
    width: '100%',
    zIndex: 10
  }
});
