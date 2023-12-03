import { MenuProvider } from "react-native-popup-menu";
import { ToolbarProvider } from "./ToolBarProvider";
import { ModalProvider } from "./ModalProvider";
import { DrawerProvider } from "./DrawerProvider";

export const AppProviders = ({ children }) => {
  return (
    <MenuProvider>
      <ToolbarProvider>
        <ModalProvider>
          <DrawerProvider>{children}</DrawerProvider>
        </ModalProvider>
      </ToolbarProvider>
    </MenuProvider>
  );
};
