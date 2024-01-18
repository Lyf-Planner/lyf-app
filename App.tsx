import { StatusBar } from "react-native";
import { useFonts } from "expo-font";
import { AuthGateway } from "./src/authorisation/AuthGateway";
import { Background } from "./src/components/Background";
import { WidgetContainer } from "./src/widgets/WidgetContainer";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { TouchableWithoutFeedback, Keyboard } from "react-native";
import { AppProviders } from "./src/hooks/hookProviders";
import { NotificationsLayer } from "./src/authorisation/NotificationsLayer";
import env from "./src/envManager";
import "expo-dev-client";

export default function App() {
  const [loaded] = useFonts({
    Inter: require("./assets/fonts/Inter/static/Inter-Regular.ttf"),
    InterMed: require("./assets/fonts/Inter/static/Inter-Medium.ttf"),
    InterSemi: require("./assets/fonts/Inter/static/Inter-SemiBold.ttf"),
  });
  if (!loaded) return null;

  console.log(env.BACKEND_URL);

  StatusBar.setBarStyle("dark-content");

  return (
    <Background>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
          <AuthGateway>
            <NotificationsLayer>
              <AppProviders>
                <WidgetContainer />
              </AppProviders>
            </NotificationsLayer>
          </AuthGateway>
        </TouchableWithoutFeedback>
      </GestureHandlerRootView>
    </Background>
  );
}
