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
import { ModalProvider } from "./src/components/modal/ModalProvider";

export default function App() {
  let [loaded] = useFonts({});

  if (!loaded) return null;

  console.log(env.BACKEND_URL);

  StatusBar.setBarStyle("dark-content");

  return (
    <Background>
      <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
        <GestureHandlerRootView style={{ flex: 1 }}>
          <MenuProvider>
            <ToolbarProvider>
              <AuthGateway>
                <ModalProvider>
                  <WidgetContainer />
                </ModalProvider>
              </AuthGateway>
            </ToolbarProvider>
          </MenuProvider>
        </GestureHandlerRootView>
      </TouchableWithoutFeedback>
    </Background>
  );
}
