import { createContext, useContext } from "react";
import { useAuth } from "../authorisation/AuthProvider";
import { LoadingScreen } from "../components/general/MiscComponents";
import { useItems } from "./useItems";

// Wraps the app in a loading screen until all data providers are ready
export const InitialisedProvider = ({ children }) => {
  const { loggingIn } = useAuth();
  const { syncing } = useItems();

  // Initialisation checks for parent hooks
  if (loggingIn) return <LoadingScreen text={"Remembering your schedule..."} />;
  else if (syncing)
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
