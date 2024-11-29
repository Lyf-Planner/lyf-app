import {
  useEffect,
  useRef,
  useState
} from 'react';
import { AppState, Platform } from 'react-native';

import { LoadingScreen } from '@/components/LoadingScreen';
import { Background } from '@/containers/Background';
import { Login } from '@/containers/Login';
import { useAuthStore } from '@/store/useAuthStore';
import { useTimetableStore } from '@/store/useTimetableStore';

type Props = {
  children: JSX.Element;
}

export const AuthWrapper = ({ children }: Props) => {
  const [lastActive, setLastActive] = useState(new Date());
  const { loggingIn, user, autologin } = useAuthStore();
  const { reload } = useTimetableStore();

  useEffect(() => {
    if (Platform.OS === 'web') {
      // force the title to prevent Expo Router mucking up route names
      document.title = 'Lyf'
    }

    if (!user) {
      console.log('No user in state, attempting autologin');
      autologin();
    }
  }, [user])

  // sync
  const appState = useRef(AppState.currentState);

  useEffect(() => {
    const refreshOnOpen = AppState.addEventListener('change', (nextAppState) => {
      if (!user) {
        return;
      }

      const appStateChangeTime = new Date();

      // Refresh user timetable if inactive for > 2 mins and entering active state
      const inactivityPeriod = appStateChangeTime.getTime() - lastActive.getTime();
      console.log('App was last active:', inactivityPeriod / 1000, 'seconds ago')
      if (inactivityPeriod > 2 * 60 * 1000 && nextAppState === 'active' && user) {
        console.log('Resyncing user after sufficient inactivity period');
        reload();
      }
      setLastActive(appStateChangeTime);
      console.log(`App ${nextAppState} at ${appStateChangeTime}`);

      appState.current = nextAppState;
    }
    );

    return () => refreshOnOpen.remove();
  }, [user, lastActive]);

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
