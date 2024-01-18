import { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableHighlight,
  Alert,
} from "react-native";
import { useAuth } from "../../../authorisation/AuthProvider";
import Entypo from "react-native-vector-icons/Entypo";

export const ItemNotification = ({
  enabled,
  time,
  notification,
  updateNotification,
  updateDrawerIndex,
}) => {
  const { user } = useAuth();
  const [localText, setText] = useState(
    `${
      notification?.minutes_before ||
      user.premium?.notifications?.event_notification_minutes_before ||
      5
    }`
  );
  const updateNotify = (notify) => updateNotification(!!notify, localText);
  const updateMinutes = (minutes_before) =>
    updateNotification(true, minutes_before);

  const updateMinutesFromInput = () => {
    updateDrawerIndex(0);
    var text = localText.replace(/[^0-9]/g, "");
    if (!text) text = "0";
    setText(text);
    updateMinutes(text);
  };

  useEffect(() => {
    notification?.minutes_before && setText(notification.minutes_before);
  }, [notification]);

  return (
    <View
      style={[styles.mainContainer, { opacity: enabled && time ? 1 : 0.3 }]}
    >
      <Text
        style={[
          styles.notifyText,
          { fontWeight: enabled && time ? "500" : "400" },
        ]}
      >
        Notify Me
      </Text>

      {!!notification && enabled && time ? (
        <View style={styles.minutesInputWrapper}>
          <TouchableHighlight
            onPress={() => updateNotify(false)}
            underlayColor={"rgba(0,0,0,0.5)"}
            style={styles.closeTouchable}
          >
            <Entypo name="cross" color="rgba(0,0,0,0.2)" size={20} />
          </TouchableHighlight>
          <TextInput
            value={localText}
            onEndEditing={updateMinutesFromInput}
            onFocus={() => updateDrawerIndex(2)}
            returnKeyType="done"
            keyboardType="numeric"
            onChangeText={setText}
            style={styles.minutesInput}
          />
          <Text style={styles.minsBeforeText}>mins before</Text>
        </View>
      ) : (
        <TouchableHighlight
          style={styles.addNotificationContainer}
          underlayColor={"rgba(0,0,0,0.5)"}
          onPress={() => {
            if (!time)
              Alert.alert(
                "Tip",
                "You need to add a time before setting a reminder :)"
              );
            else if (!enabled) {
              Alert.alert(
                "Whoops",
                "You need to enable Notifications for Lyf in your device settings"
              );
            } else updateNotify(true);
          }}
        >
          <Text style={styles.addNotificationText}>Add Reminder +</Text>
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
  notifyText: { fontSize: 20, fontWeight: "500", fontFamily: "InterSemi" },
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
    width: 45,
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
