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

// Assisted state management via provision of hooks, pertinent to whether app is in edit mode
export const DrawerProvider = ({ children }) => {
  const [drawer, updateDrawer] = useState<any>(null);

  const bottomSheetRef = useRef<BottomSheetModal>(null);

  // variables
  const snapPoints = useMemo(() => ["10%", "50%", "60%"], []);

  // callbacks
  const handlePresentModalPress = useCallback(() => {
    bottomSheetRef.current?.present();
  }, []);
  const handleSheetChanges = useCallback((index: number) => {
    console.log("handleSheetChanges", index);
  }, []);

  const EXPOSED = {
    drawer,
    updateDrawer,
  };

  useEffect(() => {
    if (drawer) handlePresentModalPress();
  }, [drawer]);

  return (
    <DrawerContext.Provider value={EXPOSED}>
      {children}
      {!!drawer && (
        <BottomSheetModal
          ref={bottomSheetRef}
          index={2}
          snapPoints={snapPoints}
          onChange={handleSheetChanges}
          enablePanDownToClose
          style={{
            shadowColor: "black",
            shadowOffset: { width: 0, height: -2 },
            shadowOpacity: 0.8,
            shadowRadius: 10,
          }}
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
