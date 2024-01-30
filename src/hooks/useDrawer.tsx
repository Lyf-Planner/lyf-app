import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { Keyboard, StyleSheet } from "react-native";
import { useAuth } from "../authorisation/AuthProvider";

// Component provider
export const DrawerProvider = ({ children }) => {
  const [drawer, updateDrawer] = useState<any>(null);
  const { user } = useAuth();

  const bottomSheetRef = useRef<BottomSheetModal>(null);

  // variables
  const snapPoints = useMemo(() => ["48%", "69%", "80%", "95%"], []);

  // callbacks
  const updateDrawerIndex = useCallback(
    (index: number) => {
      bottomSheetRef?.current && bottomSheetRef?.current?.snapToIndex(index);
    },
    [bottomSheetRef]
  );
  const handlePresentModalPress = useCallback(() => {
    bottomSheetRef.current?.present();
  }, [bottomSheetRef]);
  const handleSheetChanges = useCallback((index: number) => {}, []);

  const EXPOSED = {
    drawer,
    updateDrawer,
    updateDrawerIndex,
  };

  useEffect(() => {
    if (drawer) handlePresentModalPress();
    Keyboard.dismiss();
  }, [drawer]);

  return (
    <DrawerContext.Provider value={EXPOSED}>
      {children}
      {!!drawer && (
        <BottomSheetModal
          ref={bottomSheetRef}
          index={!!drawer?.props?.initialItem?.desc ? 1 : 0}
          snapPoints={snapPoints}
          onChange={handleSheetChanges}
          enablePanDownToClose
          style={styles.bottomSheetWrapper}
        >
          {drawer}
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
