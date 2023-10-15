import { createContext, useContext, useEffect, useState } from "react";
import { getAsyncData, storeAsyncData } from "../utils/asyncStorage";

export const AuthGateway = ({ children }) => {
  const [token, updateToken] = useState("");
  const [loggingIn, updateLoggingIn] = useState(false);

  const refreshToken = (x) => {
    updateToken(x);
    storeAsyncData("token", x);
  };

  useEffect(() => {
    // Check if we were logged in last time - ask backend if token is still valid
    getAsyncData("token").then((result) =>
      result
        .then((valid) => valid && refreshToken(result))
        .then(() => updateFetchingPrev(false))
    );
  }, []);

  if (fetchingPrev)
    return <LoadingScreen text={"Remembering who you are..."} />;
  else if (!token) return <AuthStack updateToken={(x) => refreshToken(x)} />;

  return <AuthProvider updateToken={() => {}}>{children}</AuthProvider>;
};

const AuthProvider = ({ children, updateToken }) => {
  return (
    <AuthContext.Provider value={useProvideAuth(updateToken)}>
      {children}
    </AuthContext.Provider>
  );
};

const AuthContext = createContext(null);

export const useAuthData = () => {
  return useContext(AuthContext);
};

export function useProvideAuth(updateToken) {
  const [userData, updateUserData] = useState<any>(undefined);

  const refreshData = async () => {};

  useEffect(() => {
    refreshData();
  }, []);

  // Provide these as return values to the useAuthData hook throughout the nested code
  return {
    user: userData,
    refetch: refreshData,
    logout: () => updateToken(""),
  };
}
