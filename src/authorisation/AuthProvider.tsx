import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState
} from 'react';
import {
  getAsyncData,
  deleteAsyncData
} from '../utils/asyncStorage';
import { autologin } from '../rest/auth';
import { LoadingScreen } from '../components/general/MiscComponents';
import { Login } from './Login';
import { getCalendars } from 'expo-localization';
import {
  deleteMe,
  saveUser,
} from '../rest/user';
import { AppState } from 'react-native';
import { Background } from 'components/general/Background';
import { ExposedUser } from 'schema/user';

type Props = {
  children: JSX.Element;
}

export const AuthGateway = ({ children }: Props) => {
  const [loggingIn, updateLoggingIn] = useState(false);
  const [user, setUser] = useState<ExposedUser | null>(null);
  const [lastUpdated, setLastUpdated] = useState(new Date());

  const updateUserInternal = useCallback(
    (changes: Partial<ExposedUser>) => {
      let newUser;
      if (user) {
        newUser = { ...user, ...changes};
      } else {
        // If there is no user this should be initialised with a full user
        newUser = changes as ExposedUser;
      }

      setUser({ ...newUser });
      setLastUpdated(new Date());
      updateLoggingIn(false);
    },
    [user, setUser]
  );

  const updateUser = useCallback(
    async (newUser: Partial<ExposedUser>) => {
      updateUserInternal(newUser);

      if (newUser) {
        await saveUser(newUser);
      }
    },
    [user]
  );

  const clearUser = () => setUser(null);

  const logout = () => {
    deleteAsyncData('token');
    clearUser();
  };

  const refreshUser = () =>
    getAsyncData('token').then((token) => {
      if (token) {
        autologin().then((freshUser) => {
          if (freshUser) {
            // Sync up local with external
            updateUser({
              ...freshUser,
              timezone: getCalendars()[0].timeZone
            });
          }
          updateLoggingIn(false);
        });
      } else {
        updateLoggingIn(false);
      }
    });

  // --- Sync --- //
  const appState = useRef(AppState.currentState);

  useEffect(() => {
    const refreshOnOpen = AppState.addEventListener(
      'change',
      (nextAppState) => {
        const isOpeningApp = appState.current.match(/background|inactive/) && nextAppState === 'active'

        if (isOpeningApp) {
          getAsyncData('token').then((token) => {
            if (token) {
              autologin().then((cloudUser) => {
                console.log('Syncing User');
                updateUser(cloudUser);
              });
            } else {
              updateLoggingIn(false)
            }
          });
        }

        appState.current = nextAppState;
      }
    );

    return () => refreshOnOpen.remove();
  }, [user]);

  useEffect(() => {
    // Attempt autologin when first entering
    updateLoggingIn(true);
    refreshUser();
  }, []);

  // --- Provider --- //

  const EXPOSED = {
    user,
    updateUser,
    deleteMe,
    logout,
    lastUpdated
  };

  if (loggingIn) {
    return (
      <Background>
        <LoadingScreen text={'Signing In Securely...'} />
      </Background>
    );
  } else if (!user) {
    return (
      <Background>
        <Login updateUser={updateUserInternal} />
      </Background>
    );
  }

  return (
    <AuthContext.Provider value={EXPOSED}>{children}</AuthContext.Provider>
  );
};

const AuthContext = createContext<any>(null);

export const useAuth = () => {
  return useContext(AuthContext);
};
