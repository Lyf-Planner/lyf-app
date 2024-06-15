import * as Native from 'react-native';
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NavigationContainer, Theme } from "@react-navigation/native"
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import AntDesign from 'react-native-vector-icons/AntDesign'
import Entypo from 'react-native-vector-icons/Entypo'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { TabBar } from "components/navigation/TabBar";
import { defaultTabHeader } from "components/navigation/Header";
import { offWhite } from "utils/colours";
import { Timetable } from 'pages/timetable/TimetablePage';

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

// TODO: Wire up 
export const routes = Object.freeze({
  timetable: {
    label: "Timetable",
    icon: (color: string) => <MaterialCommunityIcons name='calendar' size={30} color={color}/>,
    root: <Timetable />
  },
  lists: {
    label: "Lists",
    icon: (color: string) => <Entypo name='list' size={30} color={color} />,
    root: <Native.View></Native.View> // <Notes />
  },
  create: {
    label: "New Plan",
    icon: (color: string) => <AntDesign name='pluscircleo' size={40} color={color}/>,
    root: <Native.View></Native.View> // TODO: Add Planning page
  },
  friends: {
    label: "Friends",
    icon: (color: string) => <FontAwesome5 name="user-friends" size={27} color={color} />,
    root: <Native.View></Native.View> // TODO: Add Friends page
  },
  profile: {
    label: "Me",
    icon: (color: string) => <FontAwesome5 name="user-alt" size={25} color={color} />,
    root: <Native.View></Native.View> // <AccountWidget />
  }
});

export default function Routes() {
  const Tab = createBottomTabNavigator();

  const initialRoute = routes.timetable;

  return (
    <NavigationContainer theme={appTheme}>
      <Tab.Navigator
        initialRouteName={initialRoute.label}
        id="BottomTab"
        backBehavior="none"
        tabBar={(props) => <TabBar {...props} />}
      >
        {Object.entries(routes).map(([key, route]) => (
          <Tab.Screen
            name={key}
            key={route.label}
            component={Native.View}
            options={defaultTabHeader(route.label)}
          />
        ))}
      </Tab.Navigator>
    </NavigationContainer>
  );
}
