import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import FontAwesome6 from 'react-native-vector-icons/FontAwesome6';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

import { DayAction } from '@/components/DayAction';
import { NewItemV2 } from '@/components/NewItemV2';
import { DayProps } from '@/containers/DayDisplay';
import { ItemType } from '@/schema/database/items';
import { useTimetableStore } from '@/store/useTimetableStore';
import { deepBlue, eventsBadgeColor } from '@/utils/colours';

type Props = {
  dayProps: DayProps; // TODO LYF-651: I should associate this with a list instead of a day to be more abstract.
  addCallback?: () => void;
  editCallback?: () => void;
  editDoneCallback?: () => void;
}

enum States {
  ADD_OR_EDIT,
  ADD,
  EDIT
}

export const DayMultiAction = ({
  dayProps,
  addCallback,
  editCallback,
  editDoneCallback
}: Props) => {
  const { addItem } = useTimetableStore();

  const [addActive, setAddActive] = useState(false);
  const [editActive, setEditActive] = useState(false);

  const [newItemType, setNewItemType] = useState<ItemType>(ItemType.Event)
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
    addItem(newItemType, dayProps.items.length, {
      title,
      date: dayProps.date || undefined,
      day: dayProps.day || undefined
    });
  }

  return ( // TODO LYF-648: Fix the shadows on iOS of the action buttons
    <View style={styles.wrapper}>
      {addActive && (
        <NewItemV2
          addItemByTitle={addItemByTitle}
          setType={setNewItemType}
          type={newItemType}
        />
      )}

      <View style={styles.addOrEditWrapper}>
        <DayAction
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
        <DayAction
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
