import { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableHighlight,
} from "react-native";
import { useAuth } from "../../authorisation/AuthProvider";
import { useNotifications } from "../../authorisation/NotificationsLayer";
import Entypo from "react-native-vector-icons/Entypo";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";

export const ItemNotification = ({
  item,
  notification,
  updateNotify,
  updateMinutes,
  updateDrawerIndex,
}) => {
  const { user } = useAuth();
  const { enabled } = useNotifications();
  const [localText, setText] = useState(
    `${
      notification?.minutes_before ||
      user.premium?.notifications?.event_notification_minutes_before ||
      5
    }`
  );

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
      style={[
        styles.mainContainer,
        { opacity: enabled && item.time ? 1 : 0.3 },
      ]}
    >
      <MaterialIcons name="notifications-active" size={20} />
      <Text
        style={[
          styles.notifyText,
          { fontWeight: enabled && item.time ? "500" : "400" },
        ]}
      >
        Notify Me
      </Text>

      {!!notification && enabled && item.time && (
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
});
