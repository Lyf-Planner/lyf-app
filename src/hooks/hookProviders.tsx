import { MenuProvider } from "react-native-popup-menu";
import { ModalProvider } from "./useModal";
import { DrawerProvider } from "./useDrawer";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { ItemsProvider } from "./useItems";
import { InitialisedProvider } from "./initialisedGateway";

export const AppProviders = ({ children }) => {
  return (
    <ItemsProvider>
      <MenuProvider>
        <ModalProvider>
          <BottomSheetModalProvider>
            <DrawerProvider>
              <InitialisedProvider>{children}</InitialisedProvider>
            </DrawerProvider>
          </BottomSheetModalProvider>
        </ModalProvider>
      </MenuProvider>
    </ItemsProvider>
  );
};
