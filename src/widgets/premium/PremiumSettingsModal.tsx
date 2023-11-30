import {
  TextInput,
  View,
  Text,
  Pressable,
  StyleSheet,
  TouchableOpacity,
  TouchableHighlight,
} from "react-native";
import { PremiumIcon } from "../../components/Icons";
import { Horizontal } from "../../components/MiscComponents";
import { useAuth } from "../../authorisation/AuthProvider";
import { useModal } from "../../components/modal/ModalProvider";
import BouncyCheckbox from "react-native-bouncy-checkbox";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useState } from "react";

export const PremiumSettingsModal = ({ onClose }: any) => {
  const { data, updateData } = useAuth();
  const { updateModal } = useModal();
  const premium = data.premium;

  const closeModal = () => updateModal(null);
  const updatePremium = (premium: any) => updateData({ ...data, premium });
  const updateSettings = (settings: any) =>
    updatePremium({ ...premium, settings });

  // DAILY NOTIFICATIONS
  const dailyNotifications = (enabled: boolean) =>
    updateSettings({ ...premium.settings, daily_notifications: enabled });
  const dailyNotificationTime = (time: string) =>
    updateSettings({ ...premium.settings, daily_notification_time: time });
  const persistentDailyNotifications = (enabled: boolean) =>
    updateSettings({
      ...premium.settings,
      persistent_daily_notification: enabled,
    });

  // EVENT NOTIFICATIONS
  const eventNotifications = (enabled: boolean) =>
    updateSettings({ ...premium.settings, event_notifications: enabled });
  const eventNotificationMinutesBefore = (time: number) =>
    updateSettings({
      ...premium.settings,
      event_notification_minutes_before: time,
    });

  // MFA
  // const mfa = (enabled: boolean) =>
  //   updateSettings({ ...premium.settings, mfa: enabled });

  // COLLABORATIVE
  // const collaborativeEvents = (enabled: boolean) =>
  //   updateSettings({ ...premium.settings, collaborative_events: enabled });

  return (
    <View style={styles.mainContainer}>
      <View style={{ gap: 2 }}>
        <View style={styles.header}>
          <PremiumIcon size={50} />
          <Text style={styles.premiumTitle}>Lyf Premium</Text>
        </View>
        <Text style={styles.subtitle}>Settings</Text>
      </View>
      <Horizontal
        style={{
          opacity: 0.25,
          marginTop: 10,
          marginBottom: 4,
          borderWidth: 2,
        }}
      />
      <View
        style={{
          flexDirection: "column",
          gap: 16,
          marginTop: 14,
          height: 220,
        }}
      >
        <Setting
          updateFunc={dailyNotifications}
          enabled={premium.settings?.daily_notifications}
          name="Daily Notifications"
          desc={
            <DailyNotificationDesc
              updateTime={dailyNotificationTime}
              notificationTime={premium.settings?.daily_notification_time}
              updatePersistent={persistentDailyNotifications}
              persistent={premium.settings?.persistent_daily_notification}
            />
          }
        />
        <Setting
          updateFunc={eventNotifications}
          enabled={premium.settings?.event_notifications}
          name="Event Notifications"
          desc={
            <EventNotificationDesc
              updateTime={eventNotificationMinutesBefore}
              minutesBefore={`${premium.settings?.event_notification_minutes_before}`}
            />
          }
        />
      </View>
      <Horizontal style={{ opacity: 0.2, marginTop: 36, borderWidth: 2 }} />
      <View style={styles.bottomButtonsContainer}>
        <TouchableOpacity
          onPress={() => {
            updatePremium({ ...premium, enabled: false });
            closeModal();
          }}
          style={[
            styles.bottomButton,
            { backgroundColor: "red", opacity: 0.8 },
          ]}
          activeOpacity={1}
        >
          <Text
            style={[styles.bottomButtonText, { color: "white", fontSize: 15 }]}
          >
            Disable Premium
          </Text>
        </TouchableOpacity>
        <TouchableHighlight
          onPress={closeModal}
          style={[styles.bottomButton]}
          underlayColor={"rgba(0,0,0,0.5)"}
        >
          <Text style={[styles.bottomButtonText, { fontSize: 16 }]}>Done</Text>
        </TouchableHighlight>
      </View>
    </View>
  );
};

const Setting = ({ updateFunc, enabled, name, desc }: any) => {
  return (
    <View>
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <BouncyCheckbox
          isChecked={enabled}
          onPress={(isChecked: boolean) => updateFunc(isChecked)}
          textComponent={
            <Text style={{ fontSize: 18, fontWeight: "600", marginLeft: 8 }}>
              {name}
            </Text>
          }
        />
      </View>
      <View style={{ marginTop: 4, marginLeft: 34 }}>{desc}</View>
    </View>
  );
};

const DailyNotificationDesc = ({
  updateTime,
  notificationTime,
  updatePersistent,
  persistent,
}: any) => {
  const [showTimePicker, updateShowTimePicker] = useState(false);
  var today = new Date();
  const datePickerValue = new Date(
    `${today.getFullYear()}-${today.getMonth()}-${today.getDate()} ${notificationTime}`
  );

  return (
    <View
      style={{
        flexDirection: "row",
        flexWrap: "wrap",
        alignItems: "center",
        gap: 2,
      }}
    >
      <Text style={{ fontSize: 16, fontWeight: "300" }}>Receive reminders each day at </Text>
      <View style={{ borderRadius: 10, overflow: "hidden" }}>
        <DateTimePicker
          value={datePickerValue}
          minuteInterval={5}
          mode={"time"}
          is24Hour={true}
          onChange={(time) => {
            var dateTime = new Date(time.nativeEvent.timestamp);
            console.log();
            updateTime(`${dateTime.getHours()}:${dateTime.getMinutes()}`);
          }}
          style={{
            width: 85,
            height: 30,
            
          }}
        />
      </View>

      <Text style={{ fontSize: 16, fontWeight: "300"  }}>about your schedule for today. Will </Text>
      <TouchableHighlight
        onPress={() => updatePersistent(!persistent)}
        style={{
          backgroundColor: "rgba(0,0,0,0.08)",
          paddingVertical: 4,
          paddingHorizontal: 4,
          width: 60,
          borderRadius: 8,
        }}
        underlayColor={"rgba(0,0,0,0.5)"}
      >
        <Text
          style={{
            fontSize: 15,
            textAlign: "center",
          }}
        >
          {persistent ? "always" : "not"}
        </Text>
      </TouchableHighlight>
      <Text style={{ fontSize: 16, lineHeight: 30, fontWeight: "300"  }}>
        send a reminder if nothing is planned.
      </Text>
    </View>
  );
};

const EventNotificationDesc = ({ updateTime, minutesBefore = 5 }: any) => {
  return (
    <View
      style={{ flexDirection: "row", flexWrap: "wrap", alignItems: "center" }}
    >
      <Text style={{ fontSize: 16, lineHeight: 25, fontWeight: "300"  }}>
        Always receive reminders{" "}
      </Text>
      <TextInput
        value={minutesBefore}
        onEndEditing={() => !minutesBefore && updateTime("0")}
        returnKeyType="done"
        keyboardType="numeric"
        onChangeText={(text) => {
          text.replace(/[^0-9]/g, "");
          let val = Number(text);
          val < 1000 && updateTime(text);
        }}
        style={{
          padding: 2,
          backgroundColor: "rgba(0,0,0,0.08)",
          width: 40,
          borderRadius: 8,
          textAlign: "center",
          fontSize: 15,
        }}
      />
      <Text style={{ fontSize: 16, lineHeight: 27, fontWeight: "300"  }}>
        minutes before events with set times, as a default
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    backgroundColor: "white",
    paddingHorizontal: 20,
    paddingVertical: 25,
    marginHorizontal: 10,
    marginBottom: 70,
    borderColor: "rgba(0,0,0,0.5)",
    borderWidth: 1,
    borderRadius: 10,
    gap: 10,
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
    fontSize: 15,
  },

  bottomButtonsContainer: { flexDirection: "row", gap: 5, marginTop: 8 },
  bottomButton: {
    padding: 12,
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 0.5,
    borderRadius: 10,
  },
  bottomButtonText: {
    textAlign: "center",
  },
});
