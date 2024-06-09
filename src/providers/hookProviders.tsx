import { MenuProvider } from 'react-native-popup-menu';
import { ModalProvider } from './useModal';
import { DrawerProvider } from './useDrawer';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { ItemsProvider } from './useItems';
import { InitialisedProvider } from './initialisedGateway';
import { NotesProvider } from './useNotes';
import { AuthGateway } from '../authorisation/AuthProvider';
import { TutorialProvider } from './useTutorial';
import { NotificationsLayer } from './useNotifications';
import { WidgetProvider } from './useWidgetNavigator';

type Props = {
  children: JSX.Element;
}

export const AppProviders = ({ children }: Props) => {
  return (
      <NotificationsLayer>
        <WidgetProvider>
          <ItemsProvider>
            <MenuProvider>
              <ModalProvider>
                <BottomSheetModalProvider>
                  <DrawerProvider>
                    <NotesProvider>
                      <InitialisedProvider>
                        <TutorialProvider>{children}</TutorialProvider>
                      </InitialisedProvider>
                    </NotesProvider>
                  </DrawerProvider>
                </BottomSheetModalProvider>
              </ModalProvider>
            </MenuProvider>
          </ItemsProvider>
        </WidgetProvider>
      </NotificationsLayer>
  );
};
