import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState
} from 'react';
import { BottomSheetModal, BottomSheetView } from '@gorhom/bottom-sheet';
import { Keyboard, StyleSheet } from 'react-native';

type Props = {
  children: JSX.Element;
}

type DrawerBody = JSX.Element | undefined
export type DrawerHooks = {
  drawer: DrawerBody,
  updateDrawer: (drawer: DrawerBody | undefined) => void
  updateSheetMinHeight: (height: number) => void
}

// Component provider
export const DrawerProvider = ({ children }: Props) => {
  const [drawer, updateDrawer] = useState<JSX.Element | undefined>(undefined);
  const [minHeight, updateMinHeight] = useState<number>(100);

  const bottomSheetRef = useRef<BottomSheetModal>(null);

  // callbacks
  const handlePresentModalPress = useCallback(() => {
    bottomSheetRef.current?.present();
  }, [bottomSheetRef]);
  const handleSheetChanges = useCallback((index: number) => {}, []);

  useEffect(() => {
    if (drawer) {
      handlePresentModalPress();
    }
    Keyboard.dismiss();
  }, [drawer]);

  const exposed = {
    drawer,
    updateDrawer,
    updateSheetMinHeight: updateMinHeight
  };

  return (
    <DrawerContext.Provider value={exposed}>
      {children}

      {drawer && (
        <BottomSheetModal
          ref={bottomSheetRef}
          enableDynamicSizing
          onChange={handleSheetChanges}
          enablePanDownToClose
          style={styles.bottomSheetWrapper}
        >
          <BottomSheetView style={{ minHeight }}>
            {drawer}
          </BottomSheetView>
        </BottomSheetModal>
      )}
    </DrawerContext.Provider>
  );
};

const DrawerContext = createContext<DrawerHooks>(undefined as any);

export const useDrawer = () => {
  return useContext(DrawerContext); // TODO: Typeguard this
};

const styles = StyleSheet.create({
  bottomSheetWrapper: {
    shadowColor: 'black',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.8,
    shadowRadius: 10
  }
});
