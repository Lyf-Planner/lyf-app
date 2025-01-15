import { DayAction } from "@/components/DayAction";
import { deepBlue, eventsBadgeColor } from "@/utils/colours";
import { StyleSheet, View } from "react-native";
import FontAwesome6 from "react-native-vector-icons/FontAwesome6";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";

type Props = {
  addAction: () => void;
  editAction: () => void;
}

export const DayMultiAction = ({
  addAction,
  editAction
}: Props) => {
  const actionContentColor = eventsBadgeColor

  return (
    <View style={styles.wrapper}>
      <DayAction 
        text="Add"
        backgroundColor={deepBlue}
        containerStyle={{ width: '49%' }} // TODO LYF-648: Get this styling to work properly
        color={actionContentColor}
        icon={(color) => (
          <FontAwesome6 
            name="plus" 
            color={color}
            size={18}
          />
        )}
        onPress={addAction}
      />
      <DayAction
        text="Edit"
        containerStyle={{ width: '49%' }} // TODO LYF-648: Get this styling to work properly
        backgroundColor={deepBlue}
        color={actionContentColor}
        icon={(color) => (
          <MaterialIcons 
            color={color} 
            name="edit" 
            size={18} 
          />
        )}
        onPress={editAction}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flexDirection: 'row',
    gap: '2%',
  }
})