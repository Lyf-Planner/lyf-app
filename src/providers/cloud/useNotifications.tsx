import {
  getPermissionsAsync,
  requestPermissionsAsync,
  getExpoPushTokenAsync
} from 'expo-notifications';
import { isDevice } from 'expo-device';
import { createContext, useContext, useEffect, useState } from 'react';
import { useAuth } from 'providers/cloud/useAuth';
import { getAsyncData, storeAsyncData } from 'utils/asyncStorage';
import env from 'envManager';

type Props = {
  children: JSX.Element;
}

type NotificationHooks = {
  enabled: boolean;
  getDefaultNotificationMins: () => number;
}

const DEFAULT_NOTIFICATION_MINS = 5;

export const NotificationsLayer = ({ children }: Props) => {
  const [enabled, setEnabled] = useState(false);
  const { user, updateUser } = useAuth();

  useEffect(() => {
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
      });
    });
  }, []);

  const getDefaultNotificationMins = () => {
    if (user?.event_notification_minutes_before) {
      return user?.event_notification_minutes_before;
    }

    return DEFAULT_NOTIFICATION_MINS;
  }

  const exposed: NotificationHooks = {
    enabled,
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
    alert('Must use physical device for Push Notifications');  
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
    projectId: env.PROJECT_ID as any
  });

  return token.data;
}

const NotificationContext = createContext<NotificationHooks>(undefined as any);

export const useNotifications = () => {
  return useContext(NotificationContext);
};
