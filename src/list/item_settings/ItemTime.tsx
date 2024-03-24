import { View, Text, StyleSheet } from "react-native";
import {
  NullTimeTextOptions,
  NullableTimePicker,
} from "../../components/NullableTimePicker";
import { useAuth } from "../../authorisation/AuthProvider";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { localisedMoment } from "../../utils/dates";

export const ItemTime = ({ item, updateItem, updateNotification, invited }) => {
  const { user } = useAuth();

  const updateTime = (time) => {
    if (invited) return;
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
      const update = { ...item, time };
      // Adjust the end time if less than time - make the window equivalent
      if (item.end_time) {
        console.log("adjusting end time");
        update.end_time = getAdjustedEndTime(time);
        console.log("adjusted end time to", update.end_time)
      }

      updateItem(update);
    }
  };

  const getAdjustedEndTime = (newTime) => {
    if (!item.time || !item.end_time || !newTime) return null;

    // Determine the original time window
    const [startHrs, startMins] = item.time.split(":");
    const [endHrs, endMins] = item.end_time.split(":");
    const startDateTime = new Date(null, null, null, startHrs, startMins);
    const endDateTime = new Date(null, null, null, endHrs, endMins);

    const window = endDateTime.getTime() - startDateTime.getTime();

    // Add that window to the provided time to get the adjusted end time!
    const [newStartHrs, newStartMins] = newTime.split(":");
    const newStartDateTime = new Date(
      null,
      null,
      null,
      newStartHrs,
      newStartMins
    );
    const newEndTime = localisedMoment(newStartDateTime)
      .add(window, "ms")
      .format("HH:mm");

    return newEndTime;
  };

  const updateEndTime = (end_time) => {
    if (invited) return;
    updateItem({ ...item, end_time });
  };

  const getDefaultEndTime = () => {
    const [hrs, mins] = item.time.split(":");
    const dateTime = new Date(null, null, null, hrs, mins);
    return localisedMoment(dateTime).add(1, "hour").format("HH:mm");
  };

  return (
    <View style={styles.mainContainer}>
      {/* 
        // @ts-ignore */}
      <MaterialIcons name="access-time" size={20} />
      <Text style={styles.eventText}>Time</Text>
      <View style={styles.pickerContainer}>
        <NullableTimePicker
          time={item.time}
          updateTime={updateTime}
          disabled={invited}
        />
        <Text style={{ marginLeft: 20, textAlign: "center" }}>-</Text>
        <NullableTimePicker
          time={item.end_time}
          updateTime={updateEndTime}
          disabled={invited}
          nullText={NullTimeTextOptions.EndTime}
          defaultTime={getDefaultEndTime()}
        />
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
  pickerContainer: {
    marginLeft: "auto",
    flexDirection: "row",
    alignItems: "center",
  },
});
