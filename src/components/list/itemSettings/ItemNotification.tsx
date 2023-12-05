import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableHighlight,
} from "react-native";
import Entypo from "react-native-vector-icons/Entypo";

export const ItemNotification = ({ item, updateItem }) => {
  const updateNotify = (notify) => updateItem({ ...item, notify });
  const updateMinutes = (minutesBefore) =>
    updateItem({ ...item, minutesBefore });

  const updateMinutesFromInput = (text) => {
    text.replace(/[^0-9]/g, "");
    let val = Number(text);
    val < 1000 && updateMinutes(text);
  };
  const replaceEmptyWithZero = () => !item.minutesBefore && updateMinutes("0");

  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        opacity: item.time ? 1 : 0.3,
        gap: 8,
        paddingRight: 10,
        height: 35,
      }}
    >
      <Text style={{ fontSize: 18, fontWeight: item.time ? "500" : "400" }}>
        Notify Me
      </Text>

      {item.notify && item.time ? (
        <View
          style={{
            marginLeft: "auto",
            flexDirection: "row",
            alignItems: "center",
            gap: 6,
          }}
        >
          <TouchableHighlight
            onPress={() => updateNotify(false)}
            underlayColor={"rgba(0,0,0,0.5)"}
            style={{ borderRadius: 5 }}
          >
            <Entypo name="cross" color="rgba(0,0,0,0.2)" size={20} />
          </TouchableHighlight>
          <TextInput
            value={item.minutesBefore}
            onEndEditing={replaceEmptyWithZero}
            returnKeyType="done"
            keyboardType="numeric"
            onChangeText={updateMinutesFromInput}
            style={styles.minutesInput}
          />
          <Text style={{ fontSize: 18, fontWeight: "200" }}>mins before</Text>
        </View>
      ) : (
        <TouchableHighlight
          style={styles.addNotificationContainer}
          underlayColor={"rgba(0,0,0,0.5)"}
          onPress={() => {
            updateNotify(true);
            !item.minutesBefore && updateMinutes("5");
          }}
        >
          <Text style={styles.addNotificationText}>Add Notification +</Text>
        </TouchableHighlight>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  minutesInput: {
    backgroundColor: "rgba(0,0,0,0.08)",
    padding: 6,
    width: 40,
    borderRadius: 8,
    fontSize: 16,
    textAlign: "center",
  },
  addNotificationContainer: {
    backgroundColor: "rgba(0,0,0,0.08)",
    marginLeft: "auto",
    padding: 8.75,
    position: "relative",
    left: 10,
    borderRadius: 8,
  },
  addNotificationText: {
    fontSize: 16,
  },
});
