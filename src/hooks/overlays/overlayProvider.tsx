import { MenuProvider } from 'react-native-popup-menu';
import { ModalProvider } from './useModal';
import { DrawerProvider } from './useDrawer';
import { TutorialProvider } from './useTutorial';
import { OverlayInjectionLayer } from './overlayInjectionLayer';

type Props = {
  children: JSX.Element;
}

export const OverlayProvider = ({ children }: Props) => (
    <MenuProvider>
      <ModalProvider>
        <DrawerProvider>
          <OverlayInjectionLayer>
            <TutorialProvider>
              {children}
            </TutorialProvider>
          </OverlayInjectionLayer>
        </DrawerProvider>
      </ModalProvider>
    </MenuProvider>
  );
