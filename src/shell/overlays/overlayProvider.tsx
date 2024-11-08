import { MenuProvider } from 'react-native-popup-menu';

import { OverlayInjectionLayer } from './overlayInjectionLayer';
import { DrawerProvider } from './useDrawer';
import { ModalProvider } from './useModal';
import { TutorialProvider } from './useTutorial';

type Props = {
  children: JSX.Element;
}

export const OverlayProvider = ({ children }: Props) => (
  <MenuProvider>
    <ModalProvider>
      <DrawerProvider>
        <TutorialProvider>
          <OverlayInjectionLayer>
            {children}
          </OverlayInjectionLayer>
        </TutorialProvider>
      </DrawerProvider>
    </ModalProvider>
  </MenuProvider>
);
