import { View, Text, StyleSheet } from "react-native";
import { NullableTimePicker } from "../../NullableTimePicker";

export const ItemEventTime = ({ time, updateTime }) => {
  return (
    <View style={styles.mainContainer}>
      <Text style={styles.eventText}>Time</Text>
      <View style={styles.pickerContainer}>
        <NullableTimePicker time={time} updateTime={updateTime} />
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
