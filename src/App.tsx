import { StatusBar, StyleSheet } from 'react-native';
import { TouchableWithoutFeedback, Keyboard } from 'react-native';

import { useFonts } from 'expo-font';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import env from './envManager';

import Routes from '@/Routes';
import { AuthWrapper } from '@/shell/AuthWrapper';
import { CloudProvider } from '@/shell/cloud/cloudProvider';
import { OverlayProvider } from '@/shell/overlays/overlayProvider';
import { RouteProvider } from '@/shell/routes';

import 'expo-dev-client';

// structural overview:
//
// components in the shell directory wrap the entire app.
// these provide basic functions such as hooks, auth logic, native interfaces etc.
//
// the core of the app you know and love is contained in Routes,
// which underpins the five key pages you see when first logged in.

export default function App() {
  const [loaded] = useFonts({
    Lexend: require('@/assets/fonts/Lexend/Lexend-VariableFont_wght.ttf'),
    LexendThin: require('@/assets/fonts/Lexend/static/Lexend-Light.ttf'),
    LexendSemibold: require('@/assets/fonts/Lexend/static/Lexend-SemiBold.ttf'),
    LexendBold: require('@/assets/fonts/Lexend/static/Lexend-ExtraBold.ttf')
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
          <AuthWrapper>
            <CloudProvider>
              <OverlayProvider>
                <Routes />
              </OverlayProvider>
            </CloudProvider>
          </AuthWrapper>
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
