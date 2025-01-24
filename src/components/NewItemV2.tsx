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
  onCancel?: () => void;
  onFocus?: () => void;
  setType: (type: ItemType) => void;
};

export const NewItemV2 = ({ addItemByTitle, onBlur, onCancel, onFocus, setType, type }: Props) => {
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
      <TextInput
        ref={inputRef}
        autoFocus
        returnKeyType="done"
        placeholder="Enter Title"
        placeholderTextColor={inProgressColor}
        style={styles.titleInput}
        blurOnSubmit={false}
        onBlur={onBlur}
        onFocus={onFocus}
        onKeyPress={(e) => {
          if (e.nativeEvent.key === 'Escape' && onCancel) {
            onCancel();
          }
        }}
        onSubmitEditing={onSubmit}
        onChangeText={onChangeText}
      />
      <ItemTypeBadge
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
    gap: 4,

    minHeight: 45,
    padding: 4,
    width: '100%'
  },
  titleInput: {
    borderRadius: 10,
    color: listNewItemText,
    flex: 1,
    fontFamily: 'Lexend',
    fontSize: 16,
    height: '100%',
    paddingHorizontal: 4,
    // @ts-expect-error this disables the input border on web, but isn't recognised by RN
    outlineStyle: 'none'
  },
  typeSwitcher: {
    marginLeft: 'auto',
    width: 60
  }
});
