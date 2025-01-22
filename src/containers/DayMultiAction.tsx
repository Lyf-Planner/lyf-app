import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import AntDesign from 'react-native-vector-icons/AntDesign';
import FontAwesome6 from 'react-native-vector-icons/FontAwesome6';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

import { DayAction } from '@/components/DayAction';
import { NewItemV2 } from '@/components/NewItemV2';
import { DayProps } from '@/containers/DayDisplay';
import { ItemType } from '@/schema/database/items';
import { useTimetableStore } from '@/store/useTimetableStore';
import { black, deepBlue, eventsBadgeColor, secondaryGreen } from '@/utils/colours';

type Props = {
  dayProps: DayProps; // TODO LYF-651: I should associate this with a list instead of a day to be more abstract.
  addCallback?: () => void;
  doneCallback?: () => void;
  editCallback?: () => void;
}

enum States {
  ADD_OR_EDIT,
  ADD,
  EDIT
}

export const DayMultiAction = ({
  dayProps,
  addCallback,
  doneCallback,
  editCallback
}: Props) => {
  const { addItem } = useTimetableStore();

  const [state, setState] = useState(States.ADD_OR_EDIT);

  const [newItemType, setNewItemType] = useState<ItemType>(ItemType.Event)
  const actionContentColor = eventsBadgeColor;

  const addItemByTitle = (title: string) => {
    addItem(newItemType, dayProps.items.length, {
      title,
      date: dayProps.date || undefined,
      day: dayProps.day || undefined
    });
  }

  const doneButton = (
    <DayAction
      text="Done"
      backgroundColor={secondaryGreen}
      color={black}
      icon={(
        <AntDesign name="checkcircle" color="black" size={18} />
      )}
      onPress={() => {
        if (doneCallback) {
          doneCallback();
        }
        setState(States.ADD_OR_EDIT)
      }}
    />
  )

  // TODO LYF-648: Fix weird flickering of opposite button when going back to ADD_OR_EDIT
  const stateMap: Record<States, JSX.Element> = {
    [States.ADD_OR_EDIT]: (
      <View style={[styles.wrapper, styles.addOrEditWrapper]}>
        <DayAction
          text="Add"
          backgroundColor={deepBlue}
          containerStyle={styles.addOrEditActionContainer}
          color={actionContentColor}
          icon={(
            <FontAwesome6
              name="plus"
              color={actionContentColor}
              size={18}
            />
          )}
          onPress={() => {
            if (addCallback) {
              addCallback();
            }
            setState(States.ADD)
          }}
        />
        <DayAction
          text="Edit"
          containerStyle={styles.addOrEditActionContainer}
          backgroundColor={deepBlue}
          color={actionContentColor}
          icon={(
            <MaterialIcons
              color={actionContentColor}
              name="edit"
              size={18}
            />
          )}
          onPress={() => {
            if (editCallback) {
              editCallback();
            }
            if (dayProps.items.length > 0) {
              setState(States.EDIT)
            }
          }}
        />
      </View>
    ),
    [States.ADD]: (
      <View style={styles.wrapper}>
        <NewItemV2
          addItemByTitle={addItemByTitle}
          setType={setNewItemType}
          type={newItemType}
        />
        {doneButton}
      </View>
    ),
    [States.EDIT]: (
      // TODO LYF-648: Verify new sort process does not cause items to flicker around
      <View style={styles.wrapper}>
        {doneButton}
      </View>
    )
  }

  return (
    <View>
      {stateMap[state]}
    </View>
  )
}

const styles = StyleSheet.create({
  addOrEditActionContainer: {
    width: '49%'
  },
  addOrEditWrapper: {
    flexDirection: 'row',
    gap: '2%'
  },

  wrapper: {
    width: '100%',
    flexDirection: 'column',
    gap: 8
  }
})
