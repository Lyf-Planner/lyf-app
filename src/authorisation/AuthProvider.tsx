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
import { ExposedUser, User } from '../schema/user';
import { updateFriendship as updateRemoteFriendship, getUser } from '../rest/user';
import { ID } from '../schema/database/abstract';
import { FriendshipAction } from '../schema/util/social';

type Props = {
  children: JSX.Element;
}

type AuthExposed = {
  user: ExposedUser | null,
  updateUser: (changes: Partial<User>) => Promise<void>,
  updateFriendship: (user_id: ID, action: FriendshipAction) => Promise<void>;
  deleteMe: (password: string) => Promise<true | undefined>,
  logout: () => void,
  lastUpdated: Date,
  refreshWithFriends: () => Promise<void>
}

export const AuthGateway = ({ children }: Props) => {
  const [loggingIn, updateLoggingIn] = useState(false);
  const [user, setUser] = useState<ExposedUser | null>(null);
  const [lastUpdated, setLastUpdated] = useState(new Date());

  // --- User Data --- //

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

  const updateFriendship = useCallback(
    async (user_id, action) => {
      if (!user) {
        return;
      }

      const friends = await updateRemoteFriendship(user_id, action);
      updateUser({ relations: { ...user.relations, users: friends } });
    },
    [user]
  );

  const refreshWithFriends = useCallback(
    async () => {
      if (!user) {
        return
      }

      const freshUser = await getUser(user.id, "users");
      updateUser(freshUser);
    },
    [user?.id]
  );

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

  const EXPOSED = {
    user,
    updateUser,
    updateFriendship,
    deleteMe,
    logout,
    lastUpdated,
    refreshWithFriends
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
    <AuthContext.Provider value={EXPOSED}>
      {children}
    </AuthContext.Provider>
  );
};

const AuthContext = createContext<AuthExposed | undefined>(undefined); // TODO: Do this better

export const useAuth = () => {
  return useContext(AuthContext) as AuthExposed;
};
