import React from "react";
import "expo-dev-client";
import { View, Dimensions, StatusBar } from "react-native";
import { useFonts } from "expo-font";


import { NavigationContainer, Theme } from "@react-navigation/native";
import { AuthGateway } from "./src/Auth/AuthProvider";

const { width, height } = Dimensions.get("window");

export const appTheme: Theme = {
  dark: false,
  colors: {
    primary: "rgb(0, 122, 255)",
    background: "#EEE",
    card: "rgb(255, 255, 255)",
    text: "rgb(28, 28, 30)",
    border: "rgb(216, 216, 216)",
    notification: "rgb(255, 59, 48)",
  },
};

export default function App() {
  let [loaded] = useFonts({
  });

  if (!loaded) return null;

  StatusBar.setBarStyle("dark-content");

  return (
    <NavigationContainer theme={appTheme}>
        <AuthGateway>
            <View
              style={{
                width,
                height: height,
              }}
            >
            
            </View>
        </AuthGateway>
    </NavigationContainer>
  );
}
