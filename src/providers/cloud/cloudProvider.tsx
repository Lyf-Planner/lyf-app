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
import { LocationProvider } from './useLocation';
import { NoticeboardProvider } from './useNoticeboard';

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

  const exposed: CloudHooks = {
    syncing,
    setSyncing
  };

  return (
    <CloudContext.Provider value={exposed}>
      <AuthGateway>
        <NoticeboardProvider>
          <NotificationsLayer>
            <LocationProvider>
              <NotesProvider>
                <TimetableProvider>
                  <FriendsProvider>
                    {children}
                  </FriendsProvider>
                </TimetableProvider>
              </NotesProvider>
            </LocationProvider>
          </NotificationsLayer>
        </NoticeboardProvider>
      </AuthGateway>
    </CloudContext.Provider>
  );
};

const CloudContext = createContext<CloudHooks>(undefined as any);

export const useCloud = () => {
  return useContext(CloudContext); // TODO: Typeguard this
};
