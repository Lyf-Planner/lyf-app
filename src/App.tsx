import { StatusBar } from 'react-native';
import { useFonts } from 'expo-font';
import { Background } from './components/general/Background';
import { WidgetContainer } from './pages/WidgetContainer';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { TouchableWithoutFeedback, Keyboard } from 'react-native';
import env from './envManager';
import 'expo-dev-client';
import Routes from 'Routes';
import { AuthGateway } from 'authorisation/AuthProvider';
import { Providers } from 'providers/providers';

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
        <AuthGateway>
          <Providers>
            <Routes />
          </Providers>
        </AuthGateway>
      </TouchableWithoutFeedback>
    </GestureHandlerRootView>
  );
}
