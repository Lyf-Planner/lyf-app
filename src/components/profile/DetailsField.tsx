import { View, Text, StyleSheet } from "react-native";

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
  detailsFieldView: { flexDirection: 'row', alignItems: 'center', height: 25 },
  detailsFieldNameText: { fontSize: 16, fontFamily: 'Lexend', width: 150, color: 'white' },
})
