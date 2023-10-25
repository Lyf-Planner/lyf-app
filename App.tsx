import "expo-dev-client";
import { View, StatusBar, Text } from "react-native";
import { useFonts } from "expo-font";
import { AuthGateway } from "./src/authorisation/AuthGateway";
import { Background } from "./src/components/Background";
import { WidgetContainer } from "./src/widgets/WidgetContainer";
import { ToolbarProvider } from "./src/components/ToolBar";

export default function App() {
  let [loaded] = useFonts({});

  if (!loaded) return null;

  StatusBar.setBarStyle("dark-content");

  return (
    <Background>
      <ToolbarProvider>
        <AuthGateway>
          <WidgetContainer />
        </AuthGateway>
      </ToolbarProvider>
    </Background>
  );
}
