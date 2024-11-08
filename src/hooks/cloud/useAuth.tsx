import {
  createContext,
  useContext,
  useEffect,
  useRef
} from 'react';
import { AppState, Platform } from 'react-native';

import { LoadingScreen } from '@/components/LoadingScreen';
import { Background } from '@/containers/Background';
import { Login } from '@/containers/Login';
import { ExposedUser, User } from '@/schema/user';
import { useAuthStore } from '@/store/useAuthStore';

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
  const { lastUpdated, loggingIn, user, autologin, logout, deleteMe, updateUser } = useAuthStore();

  useEffect(() => {
    if (Platform.OS === 'web') {
      // force the title to prevent Expo Router mucking up route names
      document.title = 'Lyf'
    }

    autologin();
  }, [])

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
