import { MenuProvider } from "react-native-popup-menu";
import { ModalProvider } from "./useModal";
import { DrawerProvider } from "./useDrawer";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";

export const AppProviders = ({ children }) => {
  return (
    <MenuProvider>
      <ModalProvider>
        <BottomSheetModalProvider>
          <DrawerProvider>{children}</DrawerProvider>
        </BottomSheetModalProvider>
      </ModalProvider>
    </MenuProvider>
  );
};
