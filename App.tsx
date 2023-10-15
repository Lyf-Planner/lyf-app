import "expo-dev-client";
import { View, StatusBar, Text } from "react-native";
import { useFonts } from "expo-font";
import { AuthGateway } from "./src/auth/AuthProvider";
import { Background } from "./src/components/Background";

export default function App() {
  let [loaded] = useFonts({});

  if (!loaded) return null;

  StatusBar.setBarStyle("dark-content");

  return (
    <Background>
      <AuthGateway>
        <View className="w-full h-full">
          <Text className="text-xl">Hello World!</Text>
        </View>
      </AuthGateway>
    </Background>
  );
}
