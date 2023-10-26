import { useEffect, useState } from "react";
import {
  getAsyncData,
  storeAsyncData,
  deleteAsyncData,
} from "../utils/asyncStorage";
import { autologin } from "../utils/login";
import { LoadingScreen } from "../components/MiscComponents";
import { Login } from "./Login";
import { AuthProvider } from "./AuthProvider";

export const AuthGateway = ({ children }) => {
  const [user, updateUser] = useState(null);
  const [loggingIn, updateLoggingIn] = useState(false);

  const logout = () => {
    deleteAsyncData("token");
    updateUser(null);
  };

  useEffect(() => {
    // Check if we were logged in last time - ask backend if token is still valid
    getAsyncData("token").then(
      (token) =>
        !!token &&
        autologin(token)
          .then((user) => user && updateUser(user))
          .then(() => updateLoggingIn(false))
    );
  }, []);

  if (loggingIn) return <LoadingScreen text={"Remembering who you are..."} />;
  else if (!user) return <Login updateUser={updateUser} />;

  return (
    <AuthProvider user={user} updateUser={updateUser} logout={logout}>
      {children}
    </AuthProvider>
  );
};
