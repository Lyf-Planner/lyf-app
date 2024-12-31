import { NavigationContainer } from '@react-navigation/native';
import { MenuProvider } from 'react-native-popup-menu';

import { NoticeboardProvider } from './shell/useNoticeboard';

import { AuthWrapper } from '@/shell/AuthWrapper';
import { RootInjectionLayer } from '@/shell/RootInjectionLayer';
import { LocationProvider } from '@/shell/useLocation';
import { NotificationsLayer } from '@/shell/useNotifications';
import { TutorialProvider } from '@/shell/useTutorial';

type Props = {
  children: JSX.Element;
}

export default function Shell({ children }: Props) {
  return (
    // Root Components
    <NavigationContainer>
      <MenuProvider>
        <TutorialProvider>

          {/* Auth Gateway + Associated Data */}
          <NoticeboardProvider>
            <AuthWrapper>
              <NotificationsLayer>
                <LocationProvider>

                  {/* Root Component Injection */}
                  <RootInjectionLayer>
                    {children}
                  </RootInjectionLayer>

                </LocationProvider>
              </NotificationsLayer>
            </AuthWrapper>
          </NoticeboardProvider>

        </TutorialProvider>
      </MenuProvider>
    </NavigationContainer>
  )
}
