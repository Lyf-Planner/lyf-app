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
} from 'utils/asyncStorage';
import { autologin } from 'rest/user';
import { LoadingScreen } from 'components/general/MiscComponents';
import { Login } from 'components/auth/Login';
import { getCalendars } from 'expo-localization';
import {
  deleteMe,
  saveUser,
} from 'rest/user';
import { AppState, Platform } from 'react-native';
import { Background } from 'components/general/Background';
import { ExposedUser, User } from 'schema/user';

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
      // Force the title to prevent Expo Router mucking around with route names
      document.title = 'Lyf'
    }
  })

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
                updateUserInternal(cloudUser);
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

  const exposed = {
    user,
    updateUser,
    deleteMe,
    logout,
    lastUpdated,
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
        <Login updateUser={updateUserInternal} />
      </Background>
    );
  }

  return (
    <AuthContext.Provider value={exposed}>
      {children}
    </AuthContext.Provider>
  );
};

const AuthContext = createContext<AuthExposed>(undefined as any); // TODO: Do this better

export const useAuth = () => {
  return useContext(AuthContext);
};
