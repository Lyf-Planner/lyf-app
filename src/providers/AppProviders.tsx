import { MenuProvider } from "react-native-popup-menu";
import { ToolbarProvider } from "./ToolBarProvider";
import { ModalProvider } from "./ModalProvider";
import { DrawerProvider } from "./DrawerProvider";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";

export const AppProviders = ({ children }) => {
  return (
    <MenuProvider>
      <ToolbarProvider>
        <ModalProvider>
          <BottomSheetModalProvider>
            <DrawerProvider>{children}</DrawerProvider>
          </BottomSheetModalProvider>
        </ModalProvider>
      </ToolbarProvider>
    </MenuProvider>
  );
};
