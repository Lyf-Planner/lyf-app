import { View, Text, StyleSheet } from 'react-native';
import { useAuth } from 'providers/cloud/useAuth';
import {
  DailyNotificationDesc,
  EventNotificationDesc
} from './NotificationDescriptions';
import { useNotifications } from 'providers/cloud/useNotifications';
import { primaryGreen } from 'utils/colours';
import BouncyCheckbox from 'react-native-bouncy-checkbox';
import { LyfElement } from 'utils/abstractTypes';

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
        <Text style={[styles.subtitle, { marginTop: 12 }]}>
          Your device has Notifications disabled for Lyf
        </Text>
      )}
      {enabled && (
        <View style={styles.settingsContainer}>
          <Setting
            updateFunc={() => dailyNotificationTime(user?.daily_notification_time ? undefined : '5')}
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
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 4,
    marginBottom: 4
  },
  premiumTitle: { fontSize: 22, fontWeight: '700' },
  subtitle: {
    textAlign: 'center',
    opacity: 0.6,
    fontWeight: '600',
    fontSize: 16
  },

  firstSeperator: {
    opacity: 0.25,
    marginTop: 10,
    marginBottom: 4,
    borderWidth: 2
  },
  settingsContainer: {
    flexDirection: 'column',
    gap: 16,
    paddingHorizontal: 4,
    marginTop: 14
  },
  settingContainer: { flexDirection: 'row', alignItems: 'center' },
  settingDescText: { fontSize: 16, lineHeight: 30, fontWeight: '300' },
  settingTitle: { fontSize: 18, fontWeight: '600', marginLeft: 8 },
  settingDescWrapper: { marginTop: 4, marginLeft: 34 },

  secondSeperator: {
    opacity: 0.2,
    marginTop: 20,
    borderWidth: 2,
    marginBottom: 8
  },
  bottomButtonsContainer: { flexDirection: 'row', gap: 5, marginTop: 8 },
  disablePremiumButton: { opacity: 0.8 },
  bottomButton: {
    padding: 12,
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 0.5,
    borderRadius: 10
  },
  doneButton: { backgroundColor: primaryGreen },
  disablePremiumText: { fontSize: 15 },
  doneText: { fontSize: 16, color: 'white', fontWeight: '600' },
  bottomButtonText: {
    textAlign: 'center'
  }
});
