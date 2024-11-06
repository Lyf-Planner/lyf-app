import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState
} from 'react';
import { AppState, Platform } from 'react-native';

import { getCalendars } from 'expo-localization';

import { LoadingScreen } from '@/components/LoadingScreen';
import { Background } from '@/containers/Background';
import { Login } from '@/containers/Login';
import { autologin } from '@/rest/auth';
import {
  deleteMe,
  saveUser
} from '@/rest/user';
import { ExposedUser, User } from '@/schema/user';
import {
  getAsyncData,
  deleteAsyncData
} from '@/utils/asyncStorage';

type Props = {
  children: JSX.Element;
}

type AuthExposed = {
  user: ExposedUser | null,
  updateUser: (changes: Partial<User>) => Promise<void>,
  deleteMe: (password: string) => Promise<true | undefined>,
  logout: () => void,
  lastUpdated: Date,
}

export const AuthGateway = ({ children }: Props) => {
  const [loggingIn, updateLoggingIn] = useState(false);
  const [user, setUser] = useState<ExposedUser | null>(null);
  const [lastUpdated, setLastUpdated] = useState(new Date());

  // --- User Data --- //

  useEffect(() => {
    if (Platform.OS === 'web') {
      // force the title to prevent Expo Router mucking up route names
      document.title = 'Lyf'
    }

    autologin();
  })

  const updateUserInternal = useCallback(
    (changes: Partial<ExposedUser>) => {
      let newUser;
      if (user) {
        newUser = { ...user, ...changes };
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

  // --- Sync --- //

  const refreshUser = () =>
    getAsyncData('token').then((token) => {
      if (token) {
        autologin().then((freshUser) => {
          if (freshUser) {
            // Sync up local with external
            updateUserInternal({
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

  // sync
  const appState = useRef(AppState.currentState);

  useEffect(() => {
    const refreshOnOpen = AppState.addEventListener(
      'change',
      (nextAppState) => {
        const isOpeningApp = appState.current.match(/background|inactive/) && nextAppState === 'active'

        if (isOpeningApp && user) {
          autologin();
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

  const exposed = {
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
  }

  if (!user) {
    return (
      <Background>
        <Login />
      </Background>
    );
  }

  return (
    <AuthContext.Provider value={exposed}>
      {children}
    </AuthContext.Provider>
  );
};

const AuthContext = createContext<AuthExposed>(undefined as never); // TODO: Do this better

export const useAuth = () => {
  return useContext(AuthContext);
};
