import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState
} from 'react';
import { Keyboard, Platform, StyleSheet } from 'react-native';

import { BottomSheetModal, BottomSheetModalProvider, BottomSheetView } from '@gorhom/bottom-sheet';

import { useModal } from './useModal';

type Props = {
  children: JSX.Element;
}

type DrawerBody = JSX.Element | undefined
export type DrawerHooks = {
  drawer: DrawerBody,
  minHeight: number,
  updateDrawer: (drawer: DrawerBody | undefined) => void
  updateSheetMinHeight: (height: number) => void
}

// Component provider
export const DrawerProvider = ({ children }: Props) => {
  const { updateModal } = useModal();

  const [drawer, updateDrawer] = useState<JSX.Element | undefined>(undefined);
  const [minHeight, updateMinHeight] = useState<number>(100);

  // On web, we replace all drawers with modals using this hacky trick
  const exposed = {
    drawer,
    minHeight,
    updateDrawer: Platform.OS == 'web' ? updateModal : updateDrawer,
    updateSheetMinHeight: updateMinHeight
  };

  return (
    <DrawerContext.Provider value={exposed}>
      {children}
    </DrawerContext.Provider>
  );
};

const DrawerContext = createContext<DrawerHooks>(undefined as never);

export const useDrawer = () => {
  return useContext(DrawerContext); // TODO: Typeguard this
};
