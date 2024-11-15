import { NavigationContainer } from '@react-navigation/native';
import { MenuProvider } from 'react-native-popup-menu';

import { AuthWrapper } from '@/shell/AuthWrapper';
import { RootInjectionLayer } from '@/shell/RootInjectionLayer';
import { DrawerProvider } from '@/shell/useDrawer';
import { LocationProvider } from '@/shell/useLocation';
import { ModalProvider } from '@/shell/useModal';
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
        <ModalProvider>
          <DrawerProvider>
            <TutorialProvider>

              {/* Auth Gateway + Associated Data */}
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

            </TutorialProvider>
          </DrawerProvider>
        </ModalProvider>
      </MenuProvider>
    </NavigationContainer>
  )
}
