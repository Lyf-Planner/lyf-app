import { MenuProvider } from 'react-native-popup-menu';
import { ModalProvider } from './useModal';
import { DrawerProvider } from './useDrawer';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { TimetableProvider } from './useTimetable';
import { NotesProvider } from './useNotes';
import { TutorialProvider } from './useTutorial';
import { NotificationsLayer } from './useNotifications';
import { WidgetProvider } from './useWidgetNavigator';

type Props = {
  children: JSX.Element;
}

export const Providers = ({ children }: Props) => {
  return (
      <NotificationsLayer>
        <WidgetProvider>
          <TimetableProvider>
            <MenuProvider>
              <ModalProvider>
                <BottomSheetModalProvider>
                  <DrawerProvider>
                    <NotesProvider>
                      <TutorialProvider>{children}</TutorialProvider>
                    </NotesProvider>
                  </DrawerProvider>
                </BottomSheetModalProvider>
              </ModalProvider>
            </MenuProvider>
          </TimetableProvider>
        </WidgetProvider>
      </NotificationsLayer>
  );
};
