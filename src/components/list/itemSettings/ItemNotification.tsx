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
  const updateMinutes = (minutes_before) =>
    updateItem({ ...item, minutes_before });

  const updateMinutesFromInput = (text) => {
    text.replace(/[^0-9]/g, "");
    let val = Number(text);
    val < 1000 && updateMinutes(text);
  };
  const replaceEmptyWithZero = () => !item.minutes_before && updateMinutes("0");

  return (
    <View style={[styles.mainContainer, { opacity: item.time ? 1 : 0.3 }]}>
      <Text
        style={[styles.notifyText, { fontWeight: item.time ? "500" : "400" }]}
      >
        Notify Me
      </Text>

      {item.notify && item.time ? (
        <View style={styles.minutesInputWrapper}>
          <TouchableHighlight
            onPress={() => updateNotify(false)}
            underlayColor={"rgba(0,0,0,0.5)"}
            style={styles.closeTouchable}
          >
            <Entypo name="cross" color="rgba(0,0,0,0.2)" size={20} />
          </TouchableHighlight>
          <TextInput
            value={item.minutes_before}
            onEndEditing={replaceEmptyWithZero}
            returnKeyType="done"
            keyboardType="numeric"
            onChangeText={updateMinutesFromInput}
            style={styles.minutesInput}
          />
          <Text style={styles.minsBeforeText}>mins before</Text>
        </View>
      ) : (
        <TouchableHighlight
          style={styles.addNotificationContainer}
          underlayColor={"rgba(0,0,0,0.5)"}
          onPress={() => {
            updateNotify(true);
            !item.minutes_before && updateMinutes("5");
          }}
        >
          <Text style={styles.addNotificationText}>Add Notification +</Text>
        </TouchableHighlight>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingRight: 10,
    height: 35,
  },
  notifyText: { fontSize: 18 },
  minutesInputWrapper: {
    marginLeft: "auto",
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  closeTouchable: { borderRadius: 5 },
  minutesInput: {
    backgroundColor: "rgba(0,0,0,0.08)",
    padding: 6,
    width: 40,
    borderRadius: 8,
    fontSize: 16,
    textAlign: "center",
  },
  minsBeforeText: { fontSize: 18, fontWeight: "200" },
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
