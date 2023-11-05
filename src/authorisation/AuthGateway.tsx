import { useEffect, useRef, useState } from "react";
import {
  getAsyncData,
  storeAsyncData,
  deleteAsyncData,
} from "../utils/asyncStorage";
import { autologin } from "../utils/login";
import { LoadingScreen } from "../components/MiscComponents";
import { Login } from "./Login";
import { AuthProvider } from "./AuthProvider";
import { AppState } from "react-native";

export const AuthGateway = ({ children }) => {
  const [user, updateUser] = useState(null);
  const [loggingIn, updateLoggingIn] = useState(false);

  const logout = () => {
    deleteAsyncData("token");
    updateUser(null);
  };

  const refreshUser = () =>
    getAsyncData("token").then((token) =>
      token
        ? autologin(token).then((freshUser) => {
            if (!!freshUser) {
              updateUser({ ...freshUser });
            }
          })
        : updateLoggingIn(false)
    );

  const appState = useRef(AppState.currentState);

  useEffect(() => {
    updateLoggingIn(false);
  }, [user]);

  useEffect(() => {
    // Check if we were logged in last time - ask backend if token is still valid
    updateLoggingIn(true);
    refreshUser();

    const refreshOnOpen = AppState.addEventListener(
      "change",
      (nextAppState) => {
        if (appState.current.match(/background/) && nextAppState === "active") {
          updateLoggingIn(true);
          refreshUser();
        }
        appState.current = nextAppState;
      }
    );

    return () => refreshOnOpen.remove();
  }, []);

  if (loggingIn) return <LoadingScreen text={"Remembering your schedule..."} />;
  else if (!user) return <Login updateUser={updateUser} />;

  return (
    <AuthProvider user={user} updateUser={updateUser} logout={logout}>
      {children}
    </AuthProvider>
  );
};
