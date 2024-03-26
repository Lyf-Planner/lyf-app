import { StyleSheet, Text, TouchableHighlight, View } from "react-native";
import { localisedMoment } from "../../utils/dates";
import DateTimePicker from "@react-native-community/datetimepicker";
import Entypo from "react-native-vector-icons/Entypo";

export enum NullTimeTextOptions {
  AddTime = "Add Time +",
  EndTime = "End Time?",
}

export const NullableTimePicker = ({
  updateTime,
  time,
  disabled = false,
  nullText = NullTimeTextOptions.AddTime,
  defaultTime = "09:00"
}) => {
  return (
    <View>
      {time ? (
        <View style={styles.leftShiftTimePicker}>
          <TimePicker time={time} updateTime={updateTime} disabled={disabled} />
        </View>
      ) : (
        <TouchableHighlight
          style={styles.addTimeContainer}
          underlayColor={"rgba(0,0,0,0.5)"}
          onPress={() => {
            updateTime(defaultTime);
          }}
        >
          <Text
            style={[
              styles.addTimeText,
              { opacity: nullText === NullTimeTextOptions.EndTime ? 0.5 : 1 },
            ]}
          >
            {nullText}
          </Text>
        </TouchableHighlight>
      )}
    </View>
  );
};

export const TimePicker = ({ time, updateTime, disabled = false }) => {
  const updateTimeFromPicker = (time) => {
    // Picker gives us a timestamp, that we need to convert to 24 hr time
    var dateTime = new Date(time.nativeEvent.timestamp);
    updateTime(localisedMoment(dateTime).format("HH:mm"));
  };

  var today = new Date();
  const datePickerValue =
    !!time &&
    new Date(
      `${today.getFullYear()}-${today.getMonth()}-${today.getDate()} ${time}`
    );

  return (
    <View style={styles.mainContainer}>
      <TouchableHighlight
        onPress={() => updateTime(null)}
        underlayColor={"rgba(0,0,0,0.5)"}
        style={styles.pressable}
      >
        {/* 
          // @ts-ignore */}
        <Entypo name="cross" color="rgba(0,0,0,0.2)" size={20} />
      </TouchableHighlight>
      <DateTimePicker
        value={datePickerValue}
        minuteInterval={5}
        mode={"time"}
        is24Hour={true}
        disabled={disabled}
        onChange={updateTimeFromPicker}
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
  addTimeContainer: {
    backgroundColor: "rgba(0,0,0,0.08)",
    padding: 8.75,
    position: "relative",
    left: 10,
    borderRadius: 8,
  },
  addTimeText: {
    fontSize: 16,
  },
  leftShiftTimePicker: { position: "relative", left: 10 },
});
