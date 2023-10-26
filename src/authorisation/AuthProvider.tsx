import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { saveUserData } from "../utils/saveUserData";
import { deleteMe } from "../utils/deleteMe";
import { getAsyncData } from "../utils/asyncStorage";
import { AppState } from "react-native";

export const AuthProvider = ({ children, user, updateUser, logout }) => {
  const [lastUpdate, setLastUpdate] = useState<any>(new Date());
  const [save, setSave] = useState({
    error: "",
    loading: false,
    latest: new Date(),
  });

  const saveAndLogout = async () => {
    var token = await getAsyncData("token");
    saveUserData(user, token);
    logout();
  };

  const updateData = (data: any) => {
    updateUser(data);
    setLastUpdate(new Date());
  };

  const autoSave = useCallback(() => {
    console.log("Checking for changes to save");
    // Check for changes
    if (lastUpdate > save.latest) {
      console.log("Autosaving...");
      saveUserData(user)
        .then(() => setSave({ ...save, loading: false, latest: new Date() }))
        .catch((error) => {
          alert(`Error saving: ${error}`);
          setSave({
            ...save,
            loading: false,
            error,
          });
        });
      console.log("Data saved.");
    } else {
      setSave({ ...save, loading: false });
    }
  }, [lastUpdate, save, setSave, user]);

  // Autosave (every 10s)
  useEffect(() => {
    const intervalId = setInterval(() => autoSave(), 10000);

    return () => {
      clearInterval(intervalId);
    };
  }, [lastUpdate, save, setSave, user]);

  // Autosave when app closes!
  useEffect(() => {
    var listener = AppState.addEventListener("change", (nextAppState) => {
      console.log("App state change detected", nextAppState);
      if (nextAppState === "inactive" || nextAppState === "background") {
        // This gets throttled by the backend when multiple requests come through
        saveUserData(user);
      }
    });
    return () => listener.remove();
  }, [save, setSave, user]);

  const EXPOSED = {
    data: user,
    updateData,
    deleteMe,
    logout: saveAndLogout,
    isSaving: save.loading,
    lastSave: save.latest,
    lastUpdate,
  };

  return (
    <AuthContext.Provider value={EXPOSED}>{children}</AuthContext.Provider>
  );
};

const AuthContext = createContext(null);

export const useAuth = () => {
  return useContext(AuthContext);
};
