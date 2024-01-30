import { View, Text, StyleSheet, TouchableHighlight } from "react-native";
import { PremiumIcon } from "../../components/Icons";
import { Horizontal } from "../../components/MiscComponents";
import { useAuth } from "../../authorisation/AuthProvider";
import { useModal } from "../../hooks/useModal";
import { primaryGreen } from "../../utils/constants";
import {
  DailyNotificationDesc,
  EventNotificationDesc,
} from "./SettingDescriptions";
import { useNotifications } from "../../authorisation/NotificationsLayer";
import BouncyCheckbox from "react-native-bouncy-checkbox";
import Feather from "react-native-vector-icons/Feather";

export const SettingsModal = () => {
  const { user, updateUser } = useAuth();
  const { enabled } = useNotifications();
  const { updateModal } = useModal();
  const premium = user.premium;

  const closeModal = () => updateModal(null);
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
      <View style={{ gap: 8, flexDirection: "column", alignItems: "center" }}>
        <Feather name="settings" size={50} />
        <Text style={styles.subtitle}>My Preferences</Text>
      </View>
      <Horizontal style={styles.firstSeperator} />
      <View style={styles.settingsContainer}>
        <Setting
          updateFunc={dailyNotifications}
          enabled={premium.notifications?.daily_notifications}
          name="Daily Notifications"
          desc={
            <DailyNotificationDesc
              updateTime={dailyNotificationTime}
              notificationTime={premium.notifications?.daily_notification_time}
              updatePersistent={persistentDailyNotifications}
              persistent={premium.notifications?.persistent_daily_notification}
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
      <Horizontal style={styles.secondSeperator} />
      {!enabled && (
        <Text style={[styles.subtitle]}>
          Warning: Your device has Notifications disabled for Lyf
        </Text>
      )}
      <View style={styles.bottomButtonsContainer}>
        <TouchableHighlight
          onPress={closeModal}
          style={[styles.bottomButton, styles.doneButton]}
          underlayColor={"rgba(0,0,0,0.5)"}
        >
          <Text style={[styles.bottomButtonText, styles.doneText]}>Done</Text>
        </TouchableHighlight>
      </View>
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
  mainContainer: {
    backgroundColor: "white",
    minWidth: "90%",
    paddingHorizontal: 15,
    paddingVertical: 25,
    marginHorizontal: 12,
    borderColor: "rgba(0,0,0,0.5)",
    borderWidth: 1,
    borderRadius: 10,
    gap: 8,
    shadowColor: "black",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 15,
  },
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
