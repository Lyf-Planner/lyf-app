import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { BottomSheetModal, BottomSheetView } from "@gorhom/bottom-sheet";
import { Keyboard, StyleSheet } from "react-native";

// Component provider
export const DrawerProvider = ({ children }) => {
  const [drawer, updateDrawer] = useState<any>(null);
  const [height, updateHeight] = useState<any>(100);

  const bottomSheetRef = useRef<BottomSheetModal>(null);

  // callbacks
  const handlePresentModalPress = useCallback(() => {
    bottomSheetRef.current?.present();
  }, [bottomSheetRef]);
  const handleSheetChanges = useCallback((index: number) => {}, []);

  const EXPOSED = {
    drawer,
    updateDrawer,
    updateSheetMinHeight: updateHeight,
  };

  useEffect(() => {
    if (drawer) handlePresentModalPress();
    Keyboard.dismiss();
  }, [drawer]);

  return (
    <DrawerContext.Provider value={EXPOSED}>
      {children}
      {!!drawer && (
        // @ts-ignore
        <BottomSheetModal
          ref={bottomSheetRef}
          enableDynamicSizing
          onChange={handleSheetChanges}
          enablePanDownToClose
          style={styles.bottomSheetWrapper}
        >
          <BottomSheetView style={{ minHeight: height }}>
            {drawer}
          </BottomSheetView>
        </BottomSheetModal>
      )}
    </DrawerContext.Provider>
  );
};

const DrawerContext = createContext(null);

export const useDrawer = () => {
  return useContext(DrawerContext);
};

const styles = StyleSheet.create({
  bottomSheetWrapper: {
    shadowColor: "black",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.8,
    shadowRadius: 10,
  },
});
