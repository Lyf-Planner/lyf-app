import { StatusBar } from "react-native";
import { useFonts } from "expo-font";
import { Background } from "./src/components/Background";
import { WidgetContainer } from "./src/widgets/WidgetContainer";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { TouchableWithoutFeedback, Keyboard } from "react-native";
import { AppProviders } from "./src/hooks/hookProviders";
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
    <GestureHandlerRootView style={{ flex: 1 }}>
      <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
        <Background>
          <AppProviders>
            <WidgetContainer />
          </AppProviders>
        </Background>
      </TouchableWithoutFeedback>
    </GestureHandlerRootView>
  );
}
