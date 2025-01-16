import { DayAction } from "@/components/DayAction";
import { black, deepBlue, eventsBadgeColor, primaryGreen, secondaryGreen } from "@/utils/colours";
import { useState } from "react";
import { StyleSheet, View } from "react-native";
import FontAwesome6 from "react-native-vector-icons/FontAwesome6";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";

type Props = {
  addAction: () => void;
  editAction: () => void;
}

enum Steps {
  ADD_OR_EDIT,
  ADD,
  EDIT,
  DONE
}

export const DayMultiAction = ({
  addAction,
  editAction
}: Props) => {
  const [step, setStep] = useState(Steps.ADD_OR_EDIT);

  const actionContentColor = eventsBadgeColor;

  // TODO LYF-648: Extract step onPress handlers to stepActionMap

  const stepElementMap: Record<Steps, JSX.Element> = {
    [Steps.ADD_OR_EDIT]: (
      <View style={styles.addOrEditWrapper}>
        <DayAction 
          text="Add"
          backgroundColor={deepBlue}
          containerStyle={{ width: '49%' }} // TODO LYF-648: Get this styling to work properly
          color={actionContentColor}
          icon={(
            <FontAwesome6 
              name="plus" 
              color={actionContentColor}
              size={18}
            />
          )}
          onPress={() => setStep(Steps.ADD)}
        />
        <DayAction
          text="Edit"
          containerStyle={{ width: '49%' }} // TODO LYF-648: Get this styling to work properly
          backgroundColor={deepBlue}
          color={actionContentColor}
          icon={(
            <MaterialIcons 
              color={actionContentColor} 
              name="edit" 
              size={18} 
            />
          )}
          onPress={() => setStep(Steps.EDIT)}
        />
      </View>
    ),
    [Steps.ADD]: ( // TODO LYF-648: Hook this up to item adding
      <View>
        <DayAction 
          text="Add"
          backgroundColor={deepBlue}
          containerStyle={{ width: '100%' }} // TODO LYF-648: Get this styling to work properly
          color={actionContentColor}
          icon={(
            <FontAwesome6 
              name="plus" 
              color={actionContentColor}
              size={18}
            />
          )}
          onPress={() => setStep(Steps.DONE)}
        />
      </View>
    ),
    [Steps.EDIT]: ( // TODO LYF-648: Hook this up to sorting mode
      <View>
        <DayAction
          text="Edit"
          containerStyle={{ width: '100%' }} // TODO LYF-648: Get this styling to work properly
          backgroundColor={deepBlue}
          color={actionContentColor}
          icon={(
            <MaterialIcons 
              color={actionContentColor} 
              name="edit" 
              size={18} 
            />
          )}
          onPress={() => setStep(Steps.DONE)}
        />
      </View>
    ),
    [Steps.DONE]: (
      <View>
        <DayAction
          text="Done"
          containerStyle={{ width: '100%' }} // TODO LYF-648: Get this styling to work properly
          backgroundColor={secondaryGreen}
          color={black}
          icon={(
            <MaterialIcons 
              color={black} 
              name="edit" 
              size={18} 
            />
          )}
          onPress={() => setStep(Steps.ADD_OR_EDIT)}
        />
      </View>
    )
  }

  return (
    <View>
      {stepElementMap[step]}
    </View>
  )
}

const styles = StyleSheet.create({
  addOrEditWrapper: {
    flexDirection: 'row',
    gap: '2%',
  }
})