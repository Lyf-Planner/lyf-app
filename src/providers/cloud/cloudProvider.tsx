import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState
} from 'react';
import { BottomSheetModal, BottomSheetView } from '@gorhom/bottom-sheet';
import { Keyboard, StyleSheet } from 'react-native';
import { AuthGateway } from './useAuth';
import { NotificationsLayer } from './useNotifications';
import { TimetableProvider } from './useTimetable';
import { NotesProvider } from './useNotes';
import { FriendsProvider } from './useFriends';

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
//   needs to be quite simple as to not call those components
// - Should in turn consider the auth gateway being seperate to the cloud layer and come last

export const CloudProvider = ({ children }: Props) => {
  const [syncing, setSyncing] = useState(false);

  console.log('rendered cloud provider')

  const exposed: CloudHooks = {
    syncing,
    setSyncing
  };

  return (
    <CloudContext.Provider value={exposed}>
      <AuthGateway>
        <NotificationsLayer>
          <NotesProvider>
            <TimetableProvider>
              <FriendsProvider>
                {children}
              </FriendsProvider>
            </TimetableProvider>
          </NotesProvider>
        </NotificationsLayer>
      </AuthGateway>
    </CloudContext.Provider>
  );
};

const CloudContext = createContext<CloudHooks>(undefined as any);

export const useCloud = () => {
  return useContext(CloudContext); // TODO: Typeguard this
};
