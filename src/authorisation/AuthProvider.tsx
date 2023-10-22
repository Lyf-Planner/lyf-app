import { createContext, useContext, useEffect, useState } from "react";
import { saveUserData } from "../utils/saveUserData";
import { deleteMe } from "../utils/deleteMe";

export const AuthProvider = ({ children, user, updateUser, logout }) => {
  const [lastUpdate, setLastUpdate] = useState<any>(new Date());
  const [save, setSave] = useState({
    error: "",
    loading: false,
    latest: new Date(),
  });

  const updateData = (data: any) => {
    updateUser(data);
    setLastUpdate(new Date());
  };

  // Autosave (every 10s)
  useEffect(() => {
    const intervalId = setInterval(() => {
      // Check for changes
      if (lastUpdate > save.latest) {
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
      } else {
        setSave({ ...save, loading: false });
      }
    }, 10000);

    return () => clearInterval(intervalId); //This is important
  }, [lastUpdate, save, setSave, user]);

  const EXPOSED = {
    data: user,
    updateData,
    deleteMe,
    logout,
    isSaving: save.loading,
    lastSave: save.latest,
  };

  return (
    <AuthContext.Provider value={EXPOSED}>{children}</AuthContext.Provider>
  );
};

const AuthContext = createContext(null);

export const useAuth = () => {
  return useContext(AuthContext);
};
