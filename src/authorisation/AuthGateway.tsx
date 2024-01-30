import { useCallback, useEffect, useRef, useState } from "react";
import { getAsyncData, deleteAsyncData } from "../utils/asyncStorage";
import { autologin } from "../rest/auth";
import { LoadingScreen } from "../components/MiscComponents";
import { Login } from "./Login";
import { AuthProvider } from "./AuthProvider";
import { AppState } from "react-native";
import { getCalendars } from "expo-localization";

export const AuthGateway = ({ children }) => {
  const [loggingIn, updateLoggingIn] = useState(false);
  const [user, setUser] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [save, setSave] = useState({
    latest: new Date(),
  });

  const updateUser = useCallback(
    (user) => {
      setUser({ ...user });
      setLastUpdated(new Date());
    },
    [setUser, setLastUpdated]
  );

  const logout = () => {
    deleteAsyncData("token");
    updateUser(null);
  };

  const refreshUser = () =>
    getAsyncData("token").then((token) =>
      token
        ? autologin().then((freshUser) => {
            if (!!freshUser) {
              // Sync up local with external
              updateUser({
                ...freshUser,
                timezone: getCalendars()[0].timeZone,
              });
            } else updateLoggingIn(false);
          })
        : updateLoggingIn(false)
    );

  const appState = useRef(AppState.currentState);

  // Sync!
  useEffect(() => {
    updateLoggingIn(false);

    const refreshOnOpen = AppState.addEventListener(
      "change",
      (nextAppState) => {
        if (
          appState.current.match(/background|inactive/) &&
          nextAppState === "active" &&
          new Date().getTime() - lastUpdated.getTime() > 5 * 60 * 1000
        ) {
          console.log(
            `Refreshing user, last local update was ${
              (new Date().getTime() - lastUpdated.getTime()) / (60 * 1000)
            } mins ago`
          );
          getAsyncData("token").then(
            (token) =>
              token &&
              autologin().then((cloudUser) => {
                updateLoggingIn(true);
                updateUser(cloudUser);
                updateLoggingIn(false);
              })
          );
        }
        appState.current = nextAppState;
      }
    );

    return () => refreshOnOpen.remove();
  }, [user]);

  useEffect(() => {
    // Check if we were logged in last time - ask backend if token is still valid
    if (!user || new Date().getTime() - lastUpdated.getTime() > 5 * 60 * 1000) {
      updateLoggingIn(true);
      refreshUser();
    }
  }, []);

  if (loggingIn) return <LoadingScreen text={"Remembering your schedule..."} />;
  else if (!user?.id) return <Login updateUser={updateUser} />;

  return (
    <AuthProvider
      loggingIn={loggingIn}
      user={user}
      updateUser={updateUser}
      lastUpdated={lastUpdated}
      logout={logout}
      save={save}
      setSave={setSave}
    >
      {children}
    </AuthProvider>
  );
};
