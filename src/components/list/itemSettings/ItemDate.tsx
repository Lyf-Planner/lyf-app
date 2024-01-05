import { View, Text, StyleSheet } from "react-native";
import { NullableDatePicker } from "../../NullableDatePicker";

export const ItemDate = ({ date, updateDate }) => {
  return (
    <View style={styles.mainContainer}>
      <Text style={styles.eventText}>Date</Text>
      <View style={styles.pickerContainer}>
        <NullableDatePicker date={date} updateDate={updateDate} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingRight: 10,
    height: 35,
  },
  eventText: { fontSize: 18, fontWeight: "500" },
  pickerContainer: { marginLeft: "auto" },
});
