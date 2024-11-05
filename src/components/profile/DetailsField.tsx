import { View, Text, StyleSheet } from 'react-native';

import { LyfElement } from '@/utils/abstractTypes';
import { white } from '@/utils/colours';

type Props = {
  fieldName: string,
  fieldValue: LyfElement
}

export const DetailsField = ({ fieldName, fieldValue }: Props) => {
  return (
    <View style={styles.detailsFieldView}>
      <Text style={styles.detailsFieldNameText}>{fieldName}</Text>
      {fieldValue}
    </View>
  );
};

const styles = StyleSheet.create({
  detailsFieldNameText: { color: white, fontFamily: 'Lexend', fontSize: 16, width: 150 },
  detailsFieldView: { alignItems: 'center', flexDirection: 'row', height: 25 }
})
