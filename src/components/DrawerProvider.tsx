import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
} from "react";
import { View } from "react-native";
import BottomSheet from "@gorhom/bottom-sheet";

// Assisted state management via provision of hooks, pertinent to whether app is in edit mode
export const DrawerProvider = ({ children }) => {
  const [drawer, updateDrawer] = useState<any>(null);

  const bottomSheetRef = useRef<BottomSheet>(null);

  // variables
  const snapPoints = useMemo(() => ["25%", "50%"], []);

  // callbacks
  const handleSheetChanges = useCallback((index: number) => {
    console.log("handleSheetChanges", index);
  }, []);

  const EXPOSED = {
    drawer,
    updateDrawer,
  };

  return (
    <DrawerContext.Provider value={EXPOSED}>
      {children}
      {!!drawer && (
        <BottomSheet
          ref={bottomSheetRef}
          index={1}
          snapPoints={snapPoints}
          onChange={handleSheetChanges}
          onClose={() => updateDrawer(null)}
          enablePanDownToClose
          style={{
            shadowColor: "black",
            shadowOffset: { width: 0, height: -2 },
            shadowOpacity: 0.8,
            shadowRadius: 10,
          }}
        >
          {drawer}
        </BottomSheet>
      )}
    </DrawerContext.Provider>
  );
};

const DrawerContext = createContext(null);

export const useDrawer = () => {
  return useContext(DrawerContext);
};
