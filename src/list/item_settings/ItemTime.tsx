import { View, Text, StyleSheet } from "react-native";
import { NullableTimePicker } from "../../components/NullableTimePicker";
import { useAuth } from "../../authorisation/AuthProvider";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";

export const ItemTime = ({ item, updateItem, updateNotification }) => {
  const { user } = useAuth();

  const updateTime = (time) => {
    if (
      !item.time &&
      user.premium?.notifications?.event_notifications_enabled
    ) {
      // If user has the setting to automatically create a notification, pass the update off to notif func
      var prereq = { ...item, time };
      updateNotification(
        true,
        user.premium.notifications?.event_notification_minutes_before || "5",
        prereq
      );
    } else if (
      !time &&
      item.notifications &&
      item.notifications.find((x) => x.user_id === user.id)
    ) {
      prereq = { ...item, time: null };
      updateNotification(false, "5", prereq);
    } else {
      updateItem({ ...item, time });
    }
  };

  return (
    <View style={styles.mainContainer}>
      <MaterialIcons name="access-time" size={20} />
      <Text style={styles.eventText}>Time</Text>
      <View style={styles.pickerContainer}>
        <NullableTimePicker time={item.time} updateTime={updateTime} />
      </View>
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
  eventText: { fontSize: 20, fontWeight: "500", fontFamily: "InterSemi" },
  pickerContainer: { marginLeft: "auto" },
});
