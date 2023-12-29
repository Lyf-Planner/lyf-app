import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { saveUser, deleteMe } from "../rest/user";
import { getAsyncData } from "../utils/asyncStorage";
import { AppState } from "react-native";

export const AuthProvider = ({
  children,
  user,
  updateUser,
  lastUpdated,
  logout,
  save,
  setSave,
}) => {
  const saveAndLogout = async () => {
    var token = await getAsyncData("token");
    saveUser(user, token);
    logout();
  };

  const autoSave = useCallback(() => {
    console.log("Checking for changes to save");
    // Check for changes
    console.log(
      "last updated",
      new Date(lastUpdated),
      "latest",
      new Date(save.latest),
      "should save",
      new Date(lastUpdated) > new Date(save.latest)
    );
    if (new Date(lastUpdated) > new Date(save.latest)) {
      console.log("Autosaving...");
      saveUser(user)
        .then(() => setSave({ latest: new Date() }))
        .catch((error) => {
          alert(`Error saving: ${error}`);
        });
      console.log("Data saved.");
    }
  }, [user, save, setSave]);

  // Autosave (every 10s)
  useEffect(() => {
    const intervalId = setInterval(() => autoSave(), 10000);

    return () => {
      clearInterval(intervalId);
    };
  }, [save, setSave, user]);

  // Autosave when app closes!
  useEffect(() => {
    var listener = AppState.addEventListener("change", (nextAppState) => {
      console.log("App state change detected", nextAppState);
      if (nextAppState === "background") {
        // This gets throttled by the backend when multiple requests come through
        if (lastUpdated > save.latest) {
          saveUser(user);
          setSave({ latest: new Date() });
        }
      }
    });
    return () => listener.remove();
  }, [user, save, setSave]);

  const EXPOSED = {
    user,
    updateUser,
    deleteMe,
    logout: saveAndLogout,
    lastSave: save.latest,
    lastUpdated: lastUpdated,
  };

  return (
    <AuthContext.Provider value={EXPOSED}>{children}</AuthContext.Provider>
  );
};

const AuthContext = createContext(null);

export const useAuth = () => {
  return useContext(AuthContext);
};
