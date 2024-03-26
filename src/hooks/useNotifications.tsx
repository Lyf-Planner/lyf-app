import {
  getPermissionsAsync,
  requestPermissionsAsync,
  getExpoPushTokenAsync,
} from "expo-notifications";
import { isDevice } from "expo-device";
import { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "../authorisation/AuthProvider";
import { getAsyncData, storeAsyncData } from "../utils/asyncStorage";
import env from "../envManager";

export const NotificationsLayer = ({ children }) => {
  const [enabled, setEnabled] = useState(false);
  const { user, updateUser } = useAuth();
  useEffect(() => {
    getAsyncData("expo_token").then((token) => {
      if (!token) {
        let curTokens = user.expo_tokens || [];
        registerForPushNotificationsAsync().then((token) => {
          if (!token) {
            setEnabled(false);
            return;
          }
          setEnabled(true);
          curTokens.push(token);
          updateUser({
            ...user,
            expo_tokens: curTokens,
          });
          storeAsyncData("expo_token", token);
        });
      } else {
        setEnabled(true);
      }
    });
  }, []);

  const EXPOSED = {
    enabled,
  };

  return (
    <NotificationContext.Provider value={EXPOSED}>
      {children}
    </NotificationContext.Provider>
  );
};

async function registerForPushNotificationsAsync() {
  let token;
  console.log("Registering ExpoPushToken");

  if (isDevice) {
    const { status: existingStatus } = await getPermissionsAsync();
    let finalStatus = existingStatus;
    console.log("Existing notification status is", existingStatus);
    if (existingStatus !== "granted") {
      const { status } = await requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== "granted") {
      return;
    }
    token = await getExpoPushTokenAsync({
      projectId: env.PROJECT_ID as any,
    });
    console.log(token);
  } else {
    alert("Must use physical device for Push Notifications");
  }

  return token?.data;
}

const NotificationContext = createContext(null);

export const useNotifications = () => {
  return useContext(NotificationContext);
};
