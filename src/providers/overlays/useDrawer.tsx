import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState
} from 'react';
import { BottomSheetModal, BottomSheetModalProvider, BottomSheetView } from '@gorhom/bottom-sheet';
import { Keyboard, StyleSheet } from 'react-native';

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
  const [drawer, updateDrawer] = useState<JSX.Element | undefined>(undefined);
  const [minHeight, updateMinHeight] = useState<number>(100);

  const exposed = {
    drawer,
    minHeight,
    updateDrawer,
    updateSheetMinHeight: updateMinHeight
  };

  return (
      <DrawerContext.Provider value={exposed}>
        {children}
      </DrawerContext.Provider>
  );
};

const DrawerContext = createContext<DrawerHooks>(undefined as any);

export const useDrawer = () => {
  return useContext(DrawerContext); // TODO: Typeguard this
};
