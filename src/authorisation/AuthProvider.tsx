import { createContext, useContext } from "react";
import { saveUser, deleteMe } from "../rest/user";
import { getAsyncData } from "../utils/asyncStorage";

export const AuthProvider = ({
  children,
  loggingIn,
  user,
  updateUser,
  lastUpdated,
  logout,
}) => {
  const saveAndLogout = async () => {
    var token = await getAsyncData("token");
    saveUser(user, token);
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

  return (
    <AuthContext.Provider value={EXPOSED}>{children}</AuthContext.Provider>
  );
};

const AuthContext = createContext(null);

export const useAuth = () => {
  return useContext(AuthContext);
};
