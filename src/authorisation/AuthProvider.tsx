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
import { UserDbObject } from 'schema/database/user';
import { Background } from 'components/general/Background';

type Props = {
  children: JSX.Element;
}

export const AuthGateway = ({ children }: Props) => {
  const [loggingIn, updateLoggingIn] = useState(false);
  const [user, setUser] = useState<UserDbObject | null>(null);
  const [initiated, setInitiated] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(new Date());

  const updateUser = useCallback(
    (changes: Partial<UserDbObject>) => {
      // If user is 30 days out of date, run tutorial
      user && checkNeedsTutorial(user);

      // Then update
      let newUser;
      if (user) {
        newUser = { ...user, ...changes};
      } else {
        newUser = changes as UserDbObject;
      }

      setUser({ ...newUser });
      setLastUpdated(new Date());
      user && updateLoggingIn(false);
    },
    [user, setUser]
  );

  const clearUser = () => setUser(null);

  const checkNeedsTutorial = (user: UserDbObject) => {
    console.log(
      'Last updated was',
      (new Date().getTime() - new Date(user.last_updated).getTime()) /
        (1000 * 60 * 60 * 24),
      'days ago'
    );

    if (
      new Date().getTime() - new Date(user.last_updated).getTime() >
      1000 * 60 * 60 * 24 * 30
    ) {
      console.log(
        'Running tutorial as last_updated was over 30d ago:',
        user.last_updated
      );
      setInitiated(false);
    }
  };

  const logout = () => {
    deleteAsyncData('token');
    setInitiated(true);
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

  // Sync!
  const appState = useRef(AppState.currentState);
  useEffect(() => {
    const refreshOnOpen = AppState.addEventListener(
      'change',
      (nextAppState) => {
        if (
          appState.current.match(/background|inactive/) &&
          nextAppState === 'active'
        ) {
          getAsyncData('token').then((token) =>
            token
              ? autologin().then((cloudUser) => {
                console.log('Syncing User');
                updateUser(cloudUser);
              })
              : updateLoggingIn(false)
          );
        }
        appState.current = nextAppState;
      }
    );

    return () => refreshOnOpen.remove();
  }, [user]);

  const updateRemoteAndLocal = useCallback(
    async (newUser: Partial<UserDbObject>) => {
      updateUser(newUser);
      if (newUser) {
        const saved = await saveUser(newUser);
        if (!saved) {
          updateUser(user!);
        }
      }
    },
    [user]
  );

  useEffect(() => {
    // Attempt autologin when first entering
    updateLoggingIn(true);
    refreshUser();
  }, []);

  const EXPOSED = {
    loggingIn,
    user,
    updateUser: updateRemoteAndLocal,
    deleteMe,
    initiated,
    setInitiated,
    logout,
    lastUpdated
  };

  if (loggingIn) {
    return (
      <Background>
        <LoadingScreen text={'Signing In Securely...'} />
      </Background>
    );
  } else if (!user?.id) {
    return (
      <Background>
        <Login updateUser={updateUser} />
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
