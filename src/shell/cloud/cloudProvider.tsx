import {
  createContext,
  useContext,
  useState
} from 'react';

import { FriendsProvider } from './useFriends';
import { LocationProvider } from './useLocation';
import { NotificationsLayer } from './useNotifications';

type Props = {
  children: JSX.Element;
}

export type CloudHooks = {
  syncing: boolean,
  setSyncing: (syncing: boolean) => void;
}

// Wrapper for backend interfacing
// Notes
// - This is outside the wrapper UI, so the login interface mounted by useAuth
//   needs to be quite simple as to not call those @/components
// - Should in turn consider the auth gateway being seperate to the cloud layer and come last

export const CloudProvider = ({ children }: Props) => {
  const [syncing, setSyncing] = useState(false);

  const exposed: CloudHooks = {
    syncing,
    setSyncing
  };

  return (
    <CloudContext.Provider value={exposed}>
      <NotificationsLayer>
        <LocationProvider>
          <FriendsProvider>
            {children}
          </FriendsProvider>
        </LocationProvider>
      </NotificationsLayer>
    </CloudContext.Provider>
  );
};

const CloudContext = createContext<CloudHooks>(undefined as never);

export const useCloud = () => {
  return useContext(CloudContext);
};
