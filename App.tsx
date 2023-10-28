import "expo-dev-client";
import { StatusBar } from "react-native";
import { useFonts } from "expo-font";
import { AuthGateway } from "./src/authorisation/AuthGateway";
import { Background } from "./src/components/Background";
import { WidgetContainer } from "./src/widgets/WidgetContainer";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { ToolbarProvider } from "./src/components/ToolBar";
import env from "./src/envManager";

export default function App() {
  let [loaded] = useFonts({});

  if (!loaded) return null;

  console.log(env.BACKEND_URL);

  StatusBar.setBarStyle("dark-content");

  return (
    <Background>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <ToolbarProvider>
          <AuthGateway>
            <WidgetContainer />
          </AuthGateway>
        </ToolbarProvider>
      </GestureHandlerRootView>
    </Background>
  );
}
