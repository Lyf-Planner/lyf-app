import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import AntDesign from 'react-native-vector-icons/AntDesign';
import FontAwesome6 from 'react-native-vector-icons/FontAwesome6';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

import { DayAction } from '@/components/DayAction';
import { DayProps } from '@/containers/DayDisplay';
import { MultiTypeNewItem } from '@/containers/MultiTypeNewItem';
import { black, deepBlue, eventsBadgeColor, secondaryGreen } from '@/utils/colours';

type Props = {
  dayProps: DayProps; // TODO LYF-648: I should associate this with a list instead of a day to be more abstract.
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
  const [state, setState] = useState(States.ADD_OR_EDIT);

  const actionContentColor = eventsBadgeColor;

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
      // TODO LYF-648: Improve this to match the height of other states
      <View style={styles.wrapper}>
        <MultiTypeNewItem
          commonData={{
            date: dayProps.date || undefined,
            day: dayProps.day || undefined
          }}
          newRank={dayProps.items.length}
          onEnter={() => setState(States.ADD_OR_EDIT)}
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
