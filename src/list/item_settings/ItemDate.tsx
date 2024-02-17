import { View, Text, StyleSheet } from "react-native";
import { NullableDatePicker } from "../../components/NullableDatePicker";
import { primaryGreen } from "../../utils/constants";
import { isTemplate } from "../constants";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";

export const ItemDate = ({ item, updateItem, invited }) => {
  const routineDay = isTemplate(item) ? item.day : null;

  const updateDate = (date) => {
    if (invited) return;
    updateItem({ ...item, date });
  };

  return (
    <View style={styles.mainContainer}>
      <MaterialIcons name="date-range" size={20} />
      <Text style={styles.eventText}>Date</Text>
      <View style={styles.pickerContainer}>
        {routineDay ? (
          <View style={styles.routineContainer}>
            <Text style={styles.routineText}>{`Every ${routineDay}`}</Text>
          </View>
        ) : (
          <NullableDatePicker
            date={item.date}
            updateDate={updateDate}
            disabled={invited}
          />
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flexDirection: "row",
    gap: 8,
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
  eventText: { fontSize: 20, fontWeight: "500", fontFamily: "InterSemi" },
  pickerContainer: { marginLeft: "auto" },
});
