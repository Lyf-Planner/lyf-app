import { Alert, TouchableHighlight, Text, View, StyleSheet } from 'react-native';

import { fieldPrompt } from 'components/profile/AccountInfo';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { primaryGreen, white } from 'utils/colours';

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
  addFieldText: { color: white },
  addFieldTouchable: {
    alignItems: 'center',
    borderRadius: 10,
    flexDirection: 'row'
  },
  addFieldView: {
    alignItems: 'center',
    backgroundColor: primaryGreen,
    borderRadius: 10,
    flexDirection: 'row',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4
  }
})
