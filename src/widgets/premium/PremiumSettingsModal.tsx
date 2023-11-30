import { TextInput, View, Text, Pressable } from "react-native";
import { PremiumIcon } from "../../components/Icons";
import Entypo from "react-native-vector-icons/Entypo";
import { Horizontal } from "../../components/MiscComponents";

export const PremiumSettingsModal = ({
  onClose,
  premium,
  updatePremium,
}: any) => {
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
    <View>
      <View>
        <View>
          <View>
            <PremiumIcon />
            <Text>Lyf Premium</Text>
          </View>
          <Text>Your account currently has premium enabled</Text>
        </View>
        <Horizontal />
        <View>
          <View>
            <Text>Settings</Text>
            <Entypo name="cog" size={20} />
          </View>
          <View>
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
                  minutesBefore={
                    premium.settings?.event_notification_minutes_before
                  }
                />
              }
            />
          </View>
        </View>
        <Horizontal />
        <View>
          <Pressable
            onPress={() => {
              updatePremium({ ...premium, enabled: false });
              onClose();
            }}
          >
            Disable Premium
          </Pressable>
          <Pressable onPress={onClose}>Done</Pressable>
        </View>
      </View>
    </View>
  );
};

const Setting = ({ updateFunc, enabled, name, desc }: any) => {
  return (
    <View>
      <View>
        <View>
          <Pressable
            onPress={() => updateFunc(!enabled)}
          />
        </View>
        <Text>{name}</Text>
      </View>
      <Text>{desc}</Text>
    </View>
  );
};

const EventNotificationDesc = ({ updateTime, minutesBefore = 5 }: any) => {
  return (
    <View>
      Always receive reminders{" "}
      <TextInput
        value={minutesBefore}
        onBlur={() => !minutesBefore && updateTime(0)}
        onChangeText={(text) => {
          let val = Number(text);
          val < 1000 && updateTime(text);
        }}
      />{" "}
      minutes before events with set times, as a default
    </View>
  );
};

const DailyNotificationDesc = ({
  updateTime,
  notificationTime,
  updatePersistent,
  persistent,
}: any) => {
  return (
    <View>
      Receive reminders each day at{" "}
      <TextInput
        defaultValue={notificationTime || "09:00"}
        onChangeText={(text) => updateTime(text)}
      />{" "}
      about your schedule for today. Will{" "}
      <Pressable
        onPress={() => updatePersistent(!persistent)}
      >
        not
      </Pressable>{" "}
      send a reminder if nothing is planned.
    </View>
  );
};
