import { useCallback, useEffect, useRef, useState } from "react";
import {
  getAsyncData,
  storeAsyncData,
  deleteAsyncData,
} from "../utils/asyncStorage";
import { autologin } from "../rest/auth";
import { LoadingScreen } from "../components/MiscComponents";
import { Login } from "./Login";
import { AuthProvider } from "./AuthProvider";
import { AppState } from "react-native";

export const AuthGateway = ({ children }) => {
  const [loggingIn, updateLoggingIn] = useState(false);
  const [user, setUser] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [save, setSave] = useState({
    latest: new Date(),
  });

  const updateUser = useCallback(
    (user: any) => {
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
              updateUser(freshUser);
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
          nextAppState === "active"
        ) {
          getAsyncData("token").then(
            (token) =>
              token &&
              autologin().then((cloudUser) => {
                console.log("cloud user", cloudUser.last_updated);
                console.log("local user", lastUpdated);
                // If the cloud save is different to what we have locally, update local user!
                if (new Date(cloudUser.last_updated) > new Date(lastUpdated)) {
                  updateLoggingIn(true);
                  updateUser(cloudUser);
                  updateLoggingIn(false);
                }
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
    updateLoggingIn(true);
    refreshUser();
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
