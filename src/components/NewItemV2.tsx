import { useRef, useState } from 'react';
import { StyleSheet, TextInput, View } from 'react-native';

import { ItemTypeBadge } from '@/components/ItemTypeBadge';
import { ItemType } from '@/schema/database/items';
import { inProgressColor, listNewItemBackground, listNewItemText } from '@/utils/colours';

export type AddItemByTitle = (title: string) => void;

type Props = {
  flex?: boolean;
  type: ItemType;
  addItemByTitle: AddItemByTitle;
  onBlur?: () => void;
  onFocus?: () => void;
  setType: (type: ItemType) => void;
};

export const NewItemV2 = ({ addItemByTitle, onBlur, onFocus, setType, type }: Props) => {
  const [newItem, updateNewItem] = useState<string>('');
  const inputRef = useRef<TextInput>(null);

  const onSubmit = () => {
    if (newItem) {
      addItemByTitle(newItem);
    }
    inputRef.current?.clear();
    inputRef.current?.focus();
  };

  const onChangeText = (text: string) => updateNewItem(text.replace(/\t/g, '')); // Remove tabs in favor of switching type

  const switchType = () => {
    if (type === ItemType.Event) {
      setType(ItemType.Task);
    } else if (type === ItemType.Task) {
      setType(ItemType.Event);
    } else {
      console.warn('[NewItemV2] Did not recognise current item type');
    }
  }

  return (
    <View style={styles.listNewItem}>
      <TextInput // TODO LYF-648 Hide text input highlight border on web
        ref={inputRef}
        autoFocus
        returnKeyType="done"
        placeholder="Enter Title"
        placeholderTextColor={inProgressColor}
        style={styles.titleInput}
        blurOnSubmit={false}
        onBlur={onBlur}
        onFocus={onFocus}
        onSubmitEditing={onSubmit}
        onChangeText={onChangeText}
      />
      <ItemTypeBadge
        flex
        style={styles.typeSwitcher}
        type={type}
        onPress={() => switchType()}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  listNewItem: {
    backgroundColor: listNewItemBackground,
    borderRadius: 10,
    flexDirection: 'row',

    minHeight: 45,
    padding: 4,
    width: '100%'
  },
  titleInput: {
    borderRadius: 10,
    color: listNewItemText,
    fontFamily: 'Lexend',
    fontSize: 16,
    paddingHorizontal: 4,
    width: '80%'
  },
  typeSwitcher: {
    width: '20%'
  }
});
