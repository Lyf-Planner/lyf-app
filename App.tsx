import "expo-dev-client";
import { StatusBar } from "react-native";
import { useFonts } from "expo-font";
import { AuthGateway } from "./src/authorisation/AuthGateway";
import { Background } from "./src/components/Background";
import { WidgetContainer } from "./src/widgets/WidgetContainer";
import { GestureHandlerRootView } from "react-native-gesture-handler";

import { TouchableWithoutFeedback, Keyboard } from "react-native";

import env from "./src/envManager";
import { AppProviders } from "./src/hooks/AppProviders";

export default function App() {
  let [loaded] = useFonts({});

  if (!loaded) return null;

  console.log(env.BACKEND_URL);

  StatusBar.setBarStyle("dark-content");

  return (
    <Background>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
          <AuthGateway>
            <AppProviders>
              <WidgetContainer />
            </AppProviders>
          </AuthGateway>
        </TouchableWithoutFeedback>
      </GestureHandlerRootView>
    </Background>
  );
}
