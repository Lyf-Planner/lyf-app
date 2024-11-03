import { View, Text, StyleSheet } from 'react-native';

type Props = {
  fieldName: string,
  fieldValue: any
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
