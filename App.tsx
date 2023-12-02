import "expo-dev-client";
import { StatusBar } from "react-native";
import { useFonts } from "expo-font";
import { AuthGateway } from "./src/authorisation/AuthGateway";
import { Background } from "./src/components/Background";
import { WidgetContainer } from "./src/widgets/WidgetContainer";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { ToolbarProvider } from "./src/components/ToolBar";
import { MenuProvider } from "react-native-popup-menu";
import { TouchableWithoutFeedback, Keyboard } from "react-native";
import env from "./src/envManager";
import { ModalProvider } from "./src/components/ModalProvider";
import { DrawerProvider } from "./src/components/DrawerProvider";

export default function App() {
  let [loaded] = useFonts({});

  if (!loaded) return null;

  console.log(env.BACKEND_URL);

  StatusBar.setBarStyle("dark-content");

  return (
    <Background>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
          <MenuProvider>
            <ToolbarProvider>
              <AuthGateway>
                <ModalProvider>
                  <DrawerProvider>
                    <WidgetContainer />
                  </DrawerProvider>
                </ModalProvider>
              </AuthGateway>
            </ToolbarProvider>
          </MenuProvider>
        </TouchableWithoutFeedback>
      </GestureHandlerRootView>
    </Background>
  );
}
