import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import FontAwesome6 from 'react-native-vector-icons/FontAwesome6';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

import { ListAction } from '@/components/ListAction';
import { NewItemV2 } from '@/components/NewItemV2';
import { ItemType } from '@/schema/database/items';
import { LocalItem } from '@/schema/items';
import { useTimetableStore } from '@/store/useTimetableStore';
import { deepBlue, eventsBadgeColor } from '@/utils/colours';

export type ItemContext = Partial<LocalItem> & {
  // required data for new item creation
  sorting_rank: number
}

type Props = {
  fixedType?: ItemType;
  newItemContext: ItemContext;
  addCallback?: () => void;
  editCallback?: () => void;
  editDoneCallback?: () => void;
}

export const ListMultiAction = ({
  fixedType,
  newItemContext,
  addCallback,
  editCallback,
  editDoneCallback
}: Props) => {
  const { addItem } = useTimetableStore();

  const [addActive, setAddActive] = useState(false);
  const [editActive, setEditActive] = useState(false);

  const [newItemType, setNewItemType] = useState<ItemType>(fixedType ?? ItemType.Event);
  const actionContentColor = eventsBadgeColor;

  const toggleAddActive = () => {
    if (!addActive && addCallback) {
      addCallback();
    }

    setAddActive(!addActive);
  }

  const toggleEditActive = () => {
    if (!editActive && editCallback) {
      editCallback();
    }
    if (editActive && editDoneCallback) {
      editDoneCallback()
    }

    setEditActive(!editActive);
  }

  const addItemByTitle = (title: string) => {
    addItem(newItemType, newItemContext.sorting_rank, {
      title,
      ...newItemContext
    });
  }

  return (
    <View style={styles.wrapper}>
      {addActive && (
        <NewItemV2
          addItemByTitle={addItemByTitle}
          fixType={!!fixedType}
          setType={setNewItemType}
          type={fixedType ?? newItemType}
        />
      )}

      <View style={styles.addOrEditWrapper}>
        <ListAction
          text="Add"
          backgroundColor={deepBlue}
          containerStyle={[
            styles.addOrEditActionContainer,
            addActive ? styles.activatedButton : {}
          ]}
          color={actionContentColor}
          icon={(
            <FontAwesome6
              name="plus"
              color={actionContentColor}
              size={18}
            />
          )}
          onPress={toggleAddActive}
        />
        <ListAction
          text="Edit"
          containerStyle={[
            styles.addOrEditActionContainer,
            editActive ? styles.activatedButton : {}
          ]}
          backgroundColor={deepBlue}
          color={actionContentColor}
          icon={(
            <MaterialIcons
              color={actionContentColor}
              name="edit"
              size={18}
            />
          )}
          onPress={toggleEditActive}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  activatedButton: {
    borderWidth: 0.5,
    borderColor: eventsBadgeColor,
    borderRadius: 10
  },

  addOrEditActionContainer: {
    flex: 1
  },
  addOrEditWrapper: {
    flexDirection: 'row',
    gap: 4
  },

  wrapper: {
    width: '100%',
    flexDirection: 'column',
    gap: 8
  }
})
