import { MenuProvider } from "react-native-popup-menu";
import { ModalProvider } from "./useModal";
import { DrawerProvider } from "./useDrawer";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { ItemsProvider } from "./useItems";
import { InitialisedProvider } from "./initialisedGateway";
import { NotesProvider } from "./useNotes";

export const AppProviders = ({ children }) => {
  return (
    <BottomSheetModalProvider>
      <DrawerProvider>
        <ItemsProvider>
          <NotesProvider>
            <MenuProvider>
              <ModalProvider>
                <InitialisedProvider>{children}</InitialisedProvider>
              </ModalProvider>
            </MenuProvider>
          </NotesProvider>
        </ItemsProvider>
      </DrawerProvider>
    </BottomSheetModalProvider>
  );
};
