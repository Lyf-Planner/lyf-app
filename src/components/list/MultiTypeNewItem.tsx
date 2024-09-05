import { StyleSheet, View } from "react-native"
import { NewItem } from "./NewItem"
import { useState } from "react";
import { ItemType } from "schema/database/items";
import { LocalItem } from "schema/items";
import { useTimetable } from "providers/cloud/useTimetable";

type Props = {
  newRank: number,
  commonData: Partial<LocalItem>,
  whiteShadow?: boolean
}

export const MultiTypeNewItem = ({ newRank, commonData, whiteShadow = true }: Props) => {
  const { addItem } = useTimetable();
  const [newItemType, setNewItemType] = useState<ItemType | null>(null);

  const addItemByTitleTyped = (title: string, type: ItemType) => addItem(type, newRank, {
    title,
    ...commonData
  })

  return (
    <View style={styles.addItemSection}>
      {newItemType !== ItemType.Task &&
        <NewItem 
          addItemByTitle={(title: string) => addItemByTitleTyped(title, ItemType.Event)}
          type={ItemType.Event} 
          onBlur={() => setNewItemType(null)}
          onFocus={() => setNewItemType(ItemType.Event)}
          whiteShadow={whiteShadow}
        />
      }
      {newItemType !== ItemType.Event &&
        <NewItem
          type={ItemType.Task} 
          addItemByTitle={(title: string) => addItemByTitleTyped(title, ItemType.Task)}
          onBlur={() => setNewItemType(null)}
          onFocus={() => setNewItemType(ItemType.Task)}
          whiteShadow={whiteShadow}
        />
      }
    </View>
  )
}

const styles = StyleSheet.create({
  addItemSection: {
    flexDirection: 'row',
    width: '100%',
    gap: 4,
  }
})