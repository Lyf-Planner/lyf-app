import { useState } from 'react';
import { StyleSheet, View } from 'react-native'

import { NewItem } from '@/components/NewItem';
import { ItemType } from '@/schema/database/items';
import { LocalItem } from '@/schema/items';
import { useTimetableStore } from '@/store/useTimetableStore';

type Props = {
  newRank: number,
  commonData: Partial<LocalItem>,
}

export const MultiTypeNewItem = ({ newRank, commonData }: Props) => {
  const { addItem } = useTimetableStore();
  const [newItemType, setNewItemType] = useState<ItemType | null>(null);

  const addItemByTitleTyped = (title: string, type: ItemType) => {
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
          whiteShadow={false}
        />
      }
      {newItemType !== ItemType.Event &&
        <NewItem
          type={ItemType.Task}
          addItemByTitle={(title: string) => addItemByTitleTyped(title, ItemType.Task)}
          onBlur={() => setNewItemType(null)}
          onFocus={() => setNewItemType(ItemType.Task)}
          flex
          whiteShadow={false}
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
