import { MenuProvider } from "react-native-popup-menu";
import { ModalProvider } from "./useModal";
import { DrawerProvider } from "./useDrawer";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { ItemsProvider } from "./useItems";
import { InitialisedProvider } from "./initialisedGateway";
import { NotesProvider } from "./useNotes";
import { TutorialProvider } from "./useTutorial";

export const AppProviders = ({ children }) => {
  return (
    <BottomSheetModalProvider>
      <DrawerProvider>
        <ItemsProvider>
          <NotesProvider>
            <MenuProvider>
              <TutorialProvider>
                <ModalProvider>
                  <InitialisedProvider>{children}</InitialisedProvider>
                </ModalProvider>
              </TutorialProvider>
            </MenuProvider>
          </NotesProvider>
        </ItemsProvider>
      </DrawerProvider>
    </BottomSheetModalProvider>
  );
};
