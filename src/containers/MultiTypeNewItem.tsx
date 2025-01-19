import { useState } from 'react';
import { StyleSheet, View } from 'react-native'

import { NewItem } from '@/components/NewItem';
import { ItemType } from '@/schema/database/items';
import { LocalItem } from '@/schema/items';
import { useTimetableStore } from '@/store/useTimetableStore';

type Props = {
  newRank: number,
  commonData: Partial<LocalItem>,
  whiteShadow?: boolean,
  onEnter?: () => void;
}

export const MultiTypeNewItem = ({ newRank, commonData, whiteShadow = true, onEnter }: Props) => {
  const { addItem } = useTimetableStore();
  const [newItemType, setNewItemType] = useState<ItemType | null>(null);

  const addItemByTitleTyped = (title: string, type: ItemType) => {
    if (onEnter) {
      onEnter();
    }

    addItem(type, newRank, {
      title,
      ...commonData
    })
  }

  return (
    <View style={styles.addItemSection}>
      {newItemType !== ItemType.Task &&
        <NewItem
          addItemByTitle={(title: string) => addItemByTitleTyped(title, ItemType.Event)}
          type={ItemType.Event}
          onBlur={() => setNewItemType(null)}
          onFocus={() => setNewItemType(ItemType.Event)}
          flex
          whiteShadow={whiteShadow}
        />
      }
      {newItemType !== ItemType.Event &&
        <NewItem
          type={ItemType.Task}
          addItemByTitle={(title: string) => addItemByTitleTyped(title, ItemType.Task)}
          onBlur={() => setNewItemType(null)}
          onFocus={() => setNewItemType(ItemType.Task)}
          flex
          whiteShadow={whiteShadow}
        />
      }
    </View>
  )
}

const styles = StyleSheet.create({
  addItemSection: {
    flexDirection: 'row',
    gap: 4,
    width: '100%'
  }
})
