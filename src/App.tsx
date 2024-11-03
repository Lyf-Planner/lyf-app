import { StatusBar, StyleSheet } from 'react-native';
import { TouchableWithoutFeedback, Keyboard } from 'react-native';

import Routes from 'Routes';
import { useFonts } from 'expo-font';
import { CloudProvider } from 'hooks/cloud/cloudProvider';
import { OverlayProvider } from 'hooks/overlays/overlayProvider';
import { RouteProvider } from 'hooks/routes';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import env from './envManager';

import 'expo-dev-client';

export default function App() {
  const [loaded] = useFonts({
    Lexend: require('assets/fonts/Lexend/Lexend-VariableFont_wght.ttf'),
    LexendThin: require('assets/fonts/Lexend/static/Lexend-Light.ttf'),
    LexendSemibold: require('assets/fonts/Lexend/static/Lexend-SemiBold.ttf'),
    LexendBold: require('assets/fonts/Lexend/static/Lexend-ExtraBold.ttf')
  });

  if (!loaded) {
    return null;
  }

  StatusBar.setBarStyle('dark-content');

  console.log('Starting with backend:', env.BACKEND_URL);

  return (
    <GestureHandlerRootView style={styles.main}>
      <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()} style={styles.main}>
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

const styles = StyleSheet.create({
  main: {
    flex: 1
  }
})
