import { MenuProvider } from 'react-native-popup-menu';
import { ModalProvider } from './useModal';
import { DrawerProvider } from './useDrawer';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { TutorialProvider } from './useTutorial';

type Props = {
  children: JSX.Element;
}

export const OverlayProvider = ({ children }: Props) => {
  return (
    <MenuProvider>
      <ModalProvider>
        <BottomSheetModalProvider>
          <DrawerProvider>
            <TutorialProvider>
              {children}
            </TutorialProvider>
          </DrawerProvider>
        </BottomSheetModalProvider>
      </ModalProvider>
    </MenuProvider>
  );
};
