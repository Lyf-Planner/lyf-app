import { View, Text } from "react-native";
import { NullableTimePicker } from "../../NullableTimePicker";

export const ItemEventTime = ({ time, updateTime }) => {
  return (
    <View
      style={{ flexDirection: "row", alignItems: "center", paddingRight: 10 }}
    >
      <Text style={{ fontSize: 18, fontWeight: "500" }}>Event Time</Text>
      <View style={{ marginLeft: "auto" }}>
        <NullableTimePicker time={time} updateTime={updateTime} />
      </View>
    </View>
  );
};
