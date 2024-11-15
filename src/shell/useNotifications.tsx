import { createContext, useContext, useEffect, useState } from 'react';
import { Platform } from 'react-native';

import { isDevice } from 'expo-device';
import {
  getPermissionsAsync,
  requestPermissionsAsync,
  getExpoPushTokenAsync
} from 'expo-notifications';

import env from '@/envManager';
import { getNotifications, updateNotification } from '@/rest/user';
import { ID } from '@/schema/database/abstract';
import { Notification } from '@/schema/notifications';
import { useAuthStore } from '@/store/useAuthStore';
import { getAsyncData, storeAsyncData } from '@/utils/asyncStorage';

type Props = {
  children: JSX.Element;
}

type NotificationHooks = {
  notifications: Notification[];
  readNotification: (id: ID) => void;
  enabled: boolean;
  getDefaultNotificationMins: () => number;
}

const DEFAULT_NOTIFICATION_MINS = 5;

export const NotificationsLayer = ({ children }: Props) => {
  const { user, updateUser } = useAuthStore();
  const [enabled, setEnabled] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    const tokenPromise = async () => {
      if (Platform.OS !== 'web') {
        getAsyncData('expo_token').then((token) => {
          if (token) {
            setEnabled(true);
            return;
          }

          registerForPushNotificationsAsync().then((token) => {
            if (!token) {
              setEnabled(false);
              return;
            }

            setEnabled(true);
            updateUser({
              ...user,
              expo_tokens: [token]
            });

            storeAsyncData('expo_token', token);
          })
        })
      }
    }

    tokenPromise().then(async () => {
      const initialNotifs = await getNotifications(10);
      setNotifications(initialNotifs);
    });
  }, []);

  const readNotification = async (id: ID) => {
    const tmp = [...notifications];
    const i = tmp.findIndex((x) => x.id === id);
    if (i === -1) {
      console.error('Notification does not exist in store');
      return;
    }

    if (!tmp[i].seen) {
      tmp[i].seen = true;
      setNotifications(tmp);

      await updateNotification(id, { seen: true });
    }
  }

  const getDefaultNotificationMins = () => {
    if (user?.event_notification_mins) {
      return user?.event_notification_mins;
    }

    return DEFAULT_NOTIFICATION_MINS;
  }

  const exposed: NotificationHooks = {
    notifications,
    enabled,
    readNotification,
    getDefaultNotificationMins
  };

  return (
    <NotificationContext.Provider value={exposed}>
      {children}
    </NotificationContext.Provider>
  );
};

async function registerForPushNotificationsAsync() {
  console.log('Registering ExpoPushToken');

  if (!isDevice) {
    console.warn('Must use physical device for Push Notifications');
    return;
  }

  const { status: existingStatus } = await getPermissionsAsync();
  console.log('Existing notification status is', existingStatus);

  let finalStatus = existingStatus;

  if (existingStatus !== 'granted') {
    const { status } = await requestPermissionsAsync();
    finalStatus = status;
  }

  if (finalStatus !== 'granted') {
    return;
  }

  const token = await getExpoPushTokenAsync({
    projectId: env.PROJECT_ID
  });

  return token.data;
}

const NotificationContext = createContext<NotificationHooks>(undefined as never);

export const useNotifications = () => {
  return useContext(NotificationContext);
};
