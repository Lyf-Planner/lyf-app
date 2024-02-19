import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import {
  getAsyncData,
  deleteAsyncData,
  storeAsyncData,
} from "../utils/asyncStorage";
import { autologin } from "../rest/auth";
import { LoadingScreen } from "../components/MiscComponents";
import { Login } from "./Login";
import { getCalendars } from "expo-localization";
import {
  deleteMe,
  saveUser,
  updateFriendship as updateRemoteFriendship,
} from "../rest/user";
import { AppState } from "react-native";

export const AuthGateway = ({ children }) => {
  const [loggingIn, updateLoggingIn] = useState(false);
  const [user, setUser] = useState(null);
  const [initiated, setInitiated] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(new Date());

  const updateUser = useCallback(
    (user) => {
      setUser({ ...user });
      setLastUpdated(new Date());
    },
    [setUser]
  );

  const logout = () => {
    deleteAsyncData("token");
    updateUser(null);
  };

  const refreshUser = () =>
    getAsyncData("token").then((token) => {
      if (token) {
        autologin().then((freshUser) => {
          if (!!freshUser) {
            // Sync up local with external
            updateUser({
              ...freshUser,
              timezone: getCalendars()[0].timeZone,
            });
          }
          updateLoggingIn(false);
        });
      } else {
        updateLoggingIn(false);
      }
    });

  // Sync!
  const appState = useRef(AppState.currentState);
  useEffect(() => {
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
                console.log("Syncing User");
                updateUser(cloudUser);
              })
          );
        }
        appState.current = nextAppState;
      }
    );

    return () => refreshOnOpen.remove();
  }, [user]);

  const saveAndLogout = async (deleted = false) => {
    !deleted && saveUser(user);
    logout();
  };

  const updateRemoteAndLocal = useCallback(
    async (newUser) => {
      updateUser(newUser);
      if (newUser) {
        let saved = await saveUser(newUser);
        if (!saved) updateUser(user);
      }
    },
    [user]
  );

  const updateFriendship = useCallback(
    async (user_id, action) => {
      let social = await updateRemoteFriendship(user_id, action);
      social && updateUser({ ...user, social });
    },
    [user]
  );

  useEffect(() => {
    // Attempt autologin when first entering
    updateLoggingIn(true);
    refreshUser();
  }, []);

  const EXPOSED = {
    loggingIn,
    user,
    updateUser: updateRemoteAndLocal,
    updateFriendship,
    deleteMe,
    initiated,
    setInitiated,
    logout: saveAndLogout,
    lastUpdated,
  };

  if (loggingIn) return <LoadingScreen text={"Remembering your schedule..."} />;
  else if (!user?.id)
    return <Login updateUser={updateUser} setInitiated={setInitiated} />;

  return (
    <AuthContext.Provider value={EXPOSED}>{children}</AuthContext.Provider>
  );
};

const AuthContext = createContext(null);

export const useAuth = () => {
  return useContext(AuthContext);
};
