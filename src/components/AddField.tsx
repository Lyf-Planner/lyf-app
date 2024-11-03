import { Alert, TouchableHighlight, Text, View, StyleSheet } from "react-native";
import AntDesign from "react-native-vector-icons/AntDesign";
import { primaryGreen } from "utils/colours";
import { fieldPrompt } from "components/AccountInfo";

type Props = {
  func: (data: string) => void,
  name: string
}

export const AddField = ({ func, name }: Props) => {
  return (
    <TouchableHighlight
      style={styles.addFieldTouchable}
      onPress={() => fieldPrompt(func, name)}
    >
      <View style={styles.addFieldView}>
        <Text style={styles.addFieldText}>Add {name}</Text>
        <AntDesign name="pluscircle" color="white" />
      </View>
    </TouchableHighlight>
  );
};


const styles = StyleSheet.create({
  addFieldView: {
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 10,
    backgroundColor: primaryGreen,
    flexDirection: 'row',
    gap: 4,
    alignItems: 'center'
  },
  addFieldTouchable: {
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center'
  },
  addFieldText: { color: 'white' }
})