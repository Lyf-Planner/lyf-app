import { View, Text, StyleSheet, TouchableHighlight } from "react-native";
import { useAuth } from "../../../authorisation/AuthProvider";
import {
  DailyNotificationDesc,
  EventNotificationDesc,
} from "./NotificationDescriptions";
import { useNotifications } from "../../../authorisation/NotificationsLayer";
import BouncyCheckbox from "react-native-bouncy-checkbox";
import { primaryGreen } from "../../../utils/constants";

export const NotificationSettings = () => {
  const { user, updateUser } = useAuth();
  const { enabled } = useNotifications();
  const premium = user.premium;

  const updatePremium = (premium) => updateUser({ ...user, premium });
  const updateNotificationSettings = (notifications) =>
    updatePremium({ ...premium, notifications });

  // DAILY NOTIFICATIONS
  const dailyNotifications = (enabled: boolean) =>
    updateNotificationSettings({
      ...premium.notifications,
      daily_notifications: enabled,
      daily_notification_time:
        premium.notifications?.daily_notification_time || "08:00",
    });
  const dailyNotificationTime = (time: string) =>
    updateNotificationSettings({
      ...premium.notifications,
      daily_notification_time: time,
    });
  const persistentDailyNotifications = (enabled: boolean) =>
    updateNotificationSettings({
      ...premium.notifications,
      persistent_daily_notification: enabled,
    });

  // EVENT NOTIFICATIONS
  const eventNotifications = (enabled: boolean) =>
    updateNotificationSettings({
      ...premium.notifications,
      event_notifications_enabled: enabled,
      event_notification_minutes_before:
        premium.notifications.event_notification_minutes_before || "5",
    });
  const eventNotificationMinutesBefore = (time: number) =>
    updateNotificationSettings({
      ...premium.notifications,
      event_notification_minutes_before: time,
    });

  return (
    <View style={styles.mainContainer}>
      {!enabled && (
        <Text style={[styles.subtitle, { marginTop: 12 }]}>
          Your device has Notifications disabled for Lyf
        </Text>
      )}
      {enabled && (
        <View style={[styles.settingsContainer]}>
          <Setting
            updateFunc={dailyNotifications}
            enabled={premium.notifications?.daily_notifications}
            name="Daily Notifications"
            desc={
              <DailyNotificationDesc
                updateTime={dailyNotificationTime}
                notificationTime={
                  premium.notifications?.daily_notification_time
                }
                updatePersistent={persistentDailyNotifications}
                persistent={
                  premium.notifications?.persistent_daily_notification
                }
              />
            }
          />
          <Setting
            updateFunc={eventNotifications}
            enabled={premium.notifications?.event_notifications_enabled}
            name="Event Notifications"
            desc={
              <EventNotificationDesc
                updateMinutes={eventNotificationMinutesBefore}
                minutesBefore={
                  premium.notifications?.event_notification_minutes_before
                }
              />
            }
          />
        </View>
      )}
    </View>
  );
};

const Setting = ({ updateFunc, enabled, name, desc }) => {
  return (
    <View>
      <View style={styles.settingContainer}>
        <BouncyCheckbox
          isChecked={enabled}
          onPress={updateFunc}
          textComponent={
            <Text style={[styles.settingTitle, { opacity: enabled ? 1 : 0.5 }]}>
              {name}
            </Text>
          }
        />
      </View>
      <View style={[styles.settingDescWrapper, { opacity: enabled ? 1 : 0.5 }]}>
        {desc}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: {},
  header: {
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    gap: 4,
    marginBottom: 4,
  },
  premiumTitle: { fontSize: 22, fontWeight: "700" },
  subtitle: {
    textAlign: "center",
    opacity: 0.6,
    fontWeight: "600",
    fontSize: 16,
  },

  firstSeperator: {
    opacity: 0.25,
    marginTop: 10,
    marginBottom: 4,
    borderWidth: 2,
  },
  settingsContainer: {
    flexDirection: "column",
    gap: 16,
    paddingHorizontal: 4,
    marginTop: 14,
  },
  settingContainer: { flexDirection: "row", alignItems: "center" },
  settingDescText: { fontSize: 16, lineHeight: 30, fontWeight: "300" },
  settingTitle: { fontSize: 18, fontWeight: "600", marginLeft: 8 },
  settingDescWrapper: { marginTop: 4, marginLeft: 34 },

  secondSeperator: {
    opacity: 0.2,
    marginTop: 20,
    borderWidth: 2,
    marginBottom: 8,
  },
  bottomButtonsContainer: { flexDirection: "row", gap: 5, marginTop: 8 },
  disablePremiumButton: { opacity: 0.8 },
  bottomButton: {
    padding: 12,
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 0.5,
    borderRadius: 10,
  },
  doneButton: { backgroundColor: primaryGreen },
  disablePremiumText: { fontSize: 15 },
  doneText: { fontSize: 16, color: "white", fontWeight: "600" },
  bottomButtonText: {
    textAlign: "center",
  },
});
