import { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "../authorisation/AuthProvider";
import { useItems } from "./useItems";
import { LoadingScreen } from "../components/MiscComponents";

// Wraps the app in a loading screen until all data providers are ready
export const InitialisedProvider = ({ children }) => {
  const { loggingIn } = useAuth();
  const { initialised } = useItems();

  // Initialisation checks for parent hooks
  if (loggingIn) return <LoadingScreen text={"Remembering your schedule..."} />;
  else if (!initialised)
    return <LoadingScreen text={"Organising your timetable..."} />;
  else
    return (
      <InitialisedGateway.Provider value={{}}>
        {children}
      </InitialisedGateway.Provider>
    );
};

const InitialisedGateway = createContext(null);

export const useModal = () => {
  return useContext(InitialisedGateway);
};
