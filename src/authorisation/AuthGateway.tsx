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
import { useDispatch, useSelector } from "react-redux";
import { updateUser } from "../redux/slices/userSlice";

export const AuthGateway = ({ children }) => {
  const [loggingIn, updateLoggingIn] = useState(false);
  const user = useSelector((state: any) => state.user);
  const dispatch = useDispatch();

  const logout = () => {
    deleteAsyncData("token");
    dispatch(updateUser({}));
  };

  const refreshUser = () =>
    getAsyncData("token").then((token) =>
      token
        ? autologin(token).then((freshUser) => {
            if (!!freshUser) {
              updateUser(freshUser);
            } else updateLoggingIn(false);
          })
        : updateLoggingIn(false)
    );

  const appState = useRef(AppState.currentState);

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
              autologin(token).then((cloudUser) => {
                console.log("cloud user", cloudUser.last_updated);
                console.log("local user", user.last_updated);
                // If the cloud save is different to what we have locally, update local user!
                if (cloudUser.last_updated > user.last_updated) {
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

  console.log("user is", user);

  if (loggingIn) return <LoadingScreen text={"Remembering your schedule..."} />;
  else if (!user.user_id) return <Login updateUser={updateUser} />;

  return (
    <AuthProvider user={user} updateUser={updateUser} logout={logout}>
      {children}
    </AuthProvider>
  );
};
