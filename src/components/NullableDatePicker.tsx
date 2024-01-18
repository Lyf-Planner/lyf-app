import { StyleSheet, Text, TouchableHighlight, View } from "react-native";
import { formatDateData } from "../utils/dates";
import DateTimePicker from "@react-native-community/datetimepicker";
import Entypo from "react-native-vector-icons/Entypo";

export const NullableDatePicker = ({ updateDate, date }) => {
  return (
    <View>
      {date ? (
        <View style={styles.leftShiftDatePicker}>
          <DatePicker date={date} updateDate={updateDate} />
        </View>
      ) : (
        <TouchableHighlight
          style={styles.addDateContainer}
          underlayColor={"rgba(0,0,0,0.5)"}
          onPress={() => {
            updateDate(formatDateData(new Date()));
          }}
        >
          <Text style={styles.addDateText}>Add Date +</Text>
        </TouchableHighlight>
      )}
    </View>
  );
};

export const DatePicker = ({ date, updateDate }) => {
  const updateDateFromPicker = (date) => {
    // Picker gives us a datestamp, that we need to convert to 24 hr date
    var dateTime = new Date(date.nativeEvent.timestamp);
    updateDate(formatDateData(dateTime));
  };

  var today = new Date();
  const datePickerValue = date ? new Date(date) : today;

  return (
    <View style={styles.mainContainer}>
      <TouchableHighlight
        onPress={() => updateDate(null)}
        underlayColor={"rgba(0,0,0,0.5)"}
        style={styles.pressable}
      >
        <Entypo name="cross" color="rgba(0,0,0,0.2)" size={20} />
      </TouchableHighlight>
      <DateTimePicker
        value={datePickerValue}
        mode={"date"}
        is24Hour={true}
        onChange={updateDateFromPicker}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flexDirection: "row",
    alignItems: "center",

    justifyContent: "flex-start",
  },
  pressable: { borderRadius: 5 },
  addDateContainer: {
    backgroundColor: "rgba(0,0,0,0.08)",
    padding: 8.75,
    position: "relative",
    left: 10,
    borderRadius: 8,
  },
  addDateText: {
    fontSize: 16,
  },
  leftShiftDatePicker: { position: "relative", left: 10 },
});
