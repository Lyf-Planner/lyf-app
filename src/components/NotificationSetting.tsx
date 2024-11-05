import { View, Text, StyleSheet, Switch } from 'react-native';

import { useAuth } from 'hooks/cloud/useAuth';
import { useNotifications } from 'hooks/cloud/useNotifications';
import { LyfElement } from 'utils/abstractTypes';
import { primaryGreen, white } from 'utils/colours';

import {
  DailyNotificationDesc,
  EventNotificationDesc
} from './NotificationSettingDescriptions';

export const NotificationSettings = () => {
  const { user, updateUser } = useAuth();
  const { enabled } = useNotifications();

  // DAILY NOTIFICATIONS
  const dailyNotificationTime = (time?: string) => updateUser({ daily_notification_time: time });
  const persistentDailyNotifications = (enabled?: boolean) => updateUser({ persistent_daily_notification: enabled });

  // EVENT NOTIFICATIONS
  const eventNotificationMins = (time?: number) => updateUser({ event_notification_mins: time });

  return (
    <View style={styles.mainContainer}>
      {!enabled && (
        <Text style={styles.subtitle}>
          Your device has Notifications disabled for Lyf
        </Text>
      )}
      {enabled && (
        <View style={styles.settingsContainer}>
          <Setting
            updateFunc={() => dailyNotificationTime(user?.daily_notification_time ? undefined : '08:30')}
            enabled={!!user?.daily_notification_time}
            name="Daily Notifications"
            desc={
              <DailyNotificationDesc
                updateTime={dailyNotificationTime}
                notificationTime={user?.daily_notification_time || '08:30'}
                updatePersistent={persistentDailyNotifications}
                persistent={user?.persistent_daily_notification}
              />
            }
          />
          <Setting
            updateFunc={() => eventNotificationMins(user?.event_notification_mins ? undefined : 5)}
            enabled={!!user?.event_notification_mins}
            name="Event Notifications"
            desc={
              <EventNotificationDesc
                updateMins={eventNotificationMins}
                minsBefore={user?.event_notification_mins || 5}
              />
            }
          />
        </View>
      )}
    </View>
  );
};

type SettingProps = {
  updateFunc: () => void,
  enabled: boolean,
  name: string,
  desc: LyfElement
}

const Setting = ({ updateFunc, enabled, name, desc }: SettingProps) => {
  const conditionalStyles = {
    descWrapper: { opacity: enabled ? 1 : 0.5 }
  }

  return (
    <View style={styles.settingMain}>
      <View style={styles.settingContainer}>
        <Text style={styles.settingText}>{name}</Text>
        <Switch
          style={styles.settingToggle}
          onValueChange={updateFunc}
          value={enabled}
        />
      </View>
      <View style={conditionalStyles.descWrapper}>
        {desc}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    paddingHorizontal: 6,
    paddingVertical: 14
  },

  settingContainer: {
    alignItems: 'center',
    flexDirection: 'row'
  },
  settingMain: {
    flexDirection: 'column',
    gap: 4
  },

  settingText: {
    color: white,
    fontFamily: 'Lexend',
    fontSize: 20
  },
  settingToggle: {
    marginLeft: 'auto'
  },
  settingsContainer: {
    flexDirection: 'column',
    gap: 16,
    paddingHorizontal: 4
  },
  subtitle: {
    color: white,
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
    width: '100%'

  }
});
