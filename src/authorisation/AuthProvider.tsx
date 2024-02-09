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

export const AuthGateway = ({ children }) => {
  const [loggingIn, updateLoggingIn] = useState(false);
  const [user, setUser] = useState(null);
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

  useEffect(() => {
    // Check if we were logged in last time - ask backend if token is still valid
    if (!user) {
      updateLoggingIn(true);
      refreshUser();
    }
  }, []);

  const saveAndLogout = async () => {
    saveUser(user);
    logout();
  };

  const updateRemoteAndLocal = (user) => {
    updateUser(user);
    saveUser(user);
  };

  const EXPOSED = {
    loggingIn,
    user,
    updateUser: updateRemoteAndLocal,
    deleteMe,
    logout: saveAndLogout,
    lastUpdated: lastUpdated,
  };

  if (loggingIn) return <LoadingScreen text={"Remembering your schedule..."} />;
  else if (!user?.id) return <Login updateUser={updateUser} />;

  return (
    <AuthContext.Provider value={EXPOSED}>{children}</AuthContext.Provider>
  );
};

const AuthContext = createContext(null);

export const useAuth = () => {
  return useContext(AuthContext);
};
