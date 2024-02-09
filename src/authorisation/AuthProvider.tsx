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
import { deleteMe, saveUser } from "../rest/user";
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

  AppState.addEventListener("change", (nextAppState) => {
    if (nextAppState === "background") {
      console.log("storing lastOpen as", new Date());
      storeAsyncData("lastOpen", new Date().toISOString());
    }
  });

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

  useEffect(() => {
    getAsyncData("lastOpen").then((lastOpen) => {
      const lastDate = new Date(lastOpen);
      const overFiveMins =
        new Date().getTime() - lastDate.getTime() > 5 * 60 * 1000;

      if (!user || overFiveMins) {
        updateLoggingIn(true);
        refreshUser();
      }
    });
    // Check if we were logged in last time - ask backend if token is still valid
  }, []);

  const EXPOSED = {
    loggingIn,
    user,
    updateUser: updateRemoteAndLocal,
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
