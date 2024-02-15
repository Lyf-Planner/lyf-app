import { MenuProvider } from "react-native-popup-menu";
import { ModalProvider } from "./useModal";
import { DrawerProvider } from "./useDrawer";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { ItemsProvider } from "./useItems";
import { InitialisedProvider } from "./initialisedGateway";
import { NotesProvider } from "./useNotes";
import { AuthGateway } from "../authorisation/AuthProvider";
import { TutorialProvider } from "./useTutorial";
import { NotificationsLayer } from "../authorisation/NotificationsLayer";

export const AppProviders = ({ children }) => {
  return (
    <AuthGateway>
      <NotificationsLayer>
        <ItemsProvider>
          <BottomSheetModalProvider>
            <DrawerProvider>
              <NotesProvider>
                <MenuProvider>
                  <ModalProvider>
                    <InitialisedProvider>
                      <TutorialProvider>{children}</TutorialProvider>
                    </InitialisedProvider>
                  </ModalProvider>
                </MenuProvider>
              </NotesProvider>
            </DrawerProvider>
          </BottomSheetModalProvider>
        </ItemsProvider>
      </NotificationsLayer>
    </AuthGateway>
  );
};
