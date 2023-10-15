import { createContext, useContext, useEffect, useState } from "react";


export const AuthGateway = ({ children }) => {
  
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

  const refreshData = async () => {
    
  };

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
