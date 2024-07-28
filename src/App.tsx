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

  console.log("Starting with backend:", env.BACKEND_URL);

  return (
    <GestureHandlerRootView>
      <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
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
