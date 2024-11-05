import { useEffect, useRef, useState } from 'react';
import { StyleSheet, TextInput } from 'react-native';

import { white } from '@/utils/colours';
import { ItemDrawerProps } from '@/utils/item';

interface Props extends ItemDrawerProps {
  autoFocus?: boolean
}

export const ItemTitle = ({
  item,
  updateItem,
  updateSheetMinHeight,
  autoFocus = false
}: Props) => {
  const [title, setTitle] = useState(item.title);

  const updateTitle = (title: string) => updateItem(item, { title });

  return (
    <TextInput
      autoFocus={autoFocus}
      value={title}
      onChangeText={!item.invite_pending ? setTitle : undefined}
      style={styles.itemTitle}
      onFocus={(e) => {
        // Workaround for selectTextOnFocus={true} not working
        if (e.currentTarget && autoFocus) {
          e.currentTarget.setNativeProps({
            selection: { start: 0, end: item.title.length }
          })
        }

        updateSheetMinHeight(500);
      }}
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
    color: white,
    flex: 1,
    fontFamily: 'Lexend',
    fontSize: 18
  }
});
