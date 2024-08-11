import * as Native from 'react-native';
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NavigationContainer, NavigationProp, Theme } from "@react-navigation/native"
import { TabBar } from "components/navigation/TabBar";
import { defaultTabHeader } from "components/navigation/Header";
import { offWhite } from "utils/colours";
import { RootStackParamList, routes } from 'providers/routes';

export const appTheme: Theme = {
  dark: false,
  colors: {
    primary: 'rgb(0, 122, 255)',
    background: offWhite,
    card: 'rgb(255, 255, 255)',
    text: 'rgb(28, 28, 30)',
    border: 'rgb(216, 216, 216)',
    notification: 'rgb(255, 59, 48)'
  }
};

export default function Routes() {
  const Tab = createBottomTabNavigator<RootStackParamList>();

  const initialRoute = routes['Timetable'];

  return (
    <Tab.Navigator
      sceneContainerStyle={styles.aboveBackground}
      initialRouteName={initialRoute.label}
      id="BottomTab"
      backBehavior="none"
      tabBar={(props) => {

      return <TabBar {...props} />
      }}
    >
      {Object.values(routes).map((route) => (
        <Tab.Screen
          name={route.label}
          key={route.label}
          component={route.root}
          options={defaultTabHeader(route.label)}
        />
      ))}
      </Tab.Navigator>
  );
}

const styles = Native.StyleSheet.create({
  aboveBackground: {
    position: 'absolute',
    zIndex: 100,
    top: 0,
    bottom: 0,
    right: 0,
    left: 0
  }
})