import "expo-dev-client";
import env from "./src/envManager";
import { StatusBar } from "react-native";
import { useFonts } from "expo-font";
import { AuthGateway } from "./src/authorisation/AuthGateway";
import { Background } from "./src/components/Background";
import { WidgetContainer } from "./src/widgets/WidgetContainer";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { TouchableWithoutFeedback, Keyboard } from "react-native";
import { AppProviders } from "./src/hooks/hookProviders";
import { Provider as ReduxProvider } from "react-redux";
import { store } from "./src/redux/store";
import { NotificationsLayer } from "./src/authorisation/NotificationsLayer";

export default function App() {
  const [loaded] = useFonts({
    Baloo: require("./assets/fonts/Archivo/static/Archivo-Regular.ttf"),
    BalooMed: require("./assets/fonts/Archivo/static/Archivo-Medium.ttf"),
    BalooSemi: require("./assets/fonts/Archivo/static/Archivo-SemiBold.ttf"),
  });
  if (!loaded) return null;

  console.log(env.BACKEND_URL);

  StatusBar.setBarStyle("dark-content");

  return (
    <Background>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
          <ReduxProvider store={store}>
            <AuthGateway>
              <NotificationsLayer>
                <AppProviders>
                  <WidgetContainer />
                </AppProviders>
              </NotificationsLayer>
            </AuthGateway>
          </ReduxProvider>
        </TouchableWithoutFeedback>
      </GestureHandlerRootView>
    </Background>
  );
}
