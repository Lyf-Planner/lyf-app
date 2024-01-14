import { View, Text, StyleSheet } from "react-native";
import { NullableDatePicker } from "../../NullableDatePicker";
import { primaryGreen } from "../../../utils/constants";

export const ItemDate = ({ date, updateDate, routineDay }) => {
  return (
    <View style={styles.mainContainer}>
      <Text style={styles.eventText}>Date</Text>
      <View style={styles.pickerContainer}>
        {routineDay ? (
          <View style={styles.routineContainer}>
            <Text style={styles.routineText}>{`Every ${routineDay}`}</Text>
          </View>
        ) : (
          <NullableDatePicker date={date} updateDate={updateDate} />
        )}
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
  routineText: {
    fontSize: 16,
    color: "white",
  },
  routineContainer: {
    backgroundColor: primaryGreen,
    padding: 8,
    position: "relative",
    flexDirection: "row",
    alignItems: "center",
    left: 10,
    borderRadius: 8,
  },
  eventText: { fontSize: 20, fontWeight: "500", fontFamily: "BalooSemi" },
  pickerContainer: { marginLeft: "auto" },
});
