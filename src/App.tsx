import { StatusBar } from 'react-native';
import { useFonts } from 'expo-font';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { TouchableWithoutFeedback, Keyboard } from 'react-native';
import env from './envManager';
import 'expo-dev-client';
import Routes from 'Routes';
import { CloudProvider } from 'providers/cloud/cloudProvider';
import { OverlayProvider } from 'providers/overlays/overlayProvider';
import { RouteProvider } from 'providers/routes';
import { useEffect } from 'react';

export default function App() {
  const [loaded] = useFonts({
    Lexend: require('../assets/fonts/Lexend/Lexend-VariableFont_wght.ttf'),
    LexendThin: require('../assets/fonts/Lexend/static/Lexend-Light.ttf'),
    LexendSemibold: require('../assets/fonts/Lexend/static/Lexend-SemiBold.ttf'),
    LexendBold: require('../assets/fonts/Lexend/static/Lexend-ExtraBold.ttf')
  });

  if (!loaded) {
    return null;
  }

  StatusBar.setBarStyle('dark-content');

  useEffect(() => {
    // Force the title to prevent Expo Router mucking around with route names
    document.title = 'Lyf'
  })

  console.log("Starting with backend:", env.BACKEND_URL);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()} style={{ flex: 1 }}>
        <RouteProvider>
          <CloudProvider>
            <OverlayProvider>
              <Routes />
            </OverlayProvider>
          </CloudProvider>
        </RouteProvider>
      </TouchableWithoutFeedback>
    </GestureHandlerRootView>
  );
}
