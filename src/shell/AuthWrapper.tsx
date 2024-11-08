import {
  useEffect,
  useRef
} from 'react';
import { AppState, Platform } from 'react-native';

import { LoadingScreen } from '@/components/LoadingScreen';
import { Background } from '@/containers/Background';
import { Login } from '@/containers/Login';
import { useAuthStore } from '@/store/useAuthStore';

type Props = {
  children: JSX.Element;
}

export const AuthWrapper = ({ children }: Props) => {
  const { loggingIn, user, autologin } = useAuthStore();

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
    <>
      {children}
    </>
  );
};
