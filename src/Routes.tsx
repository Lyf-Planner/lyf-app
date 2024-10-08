import * as Native from 'react-native';
import { BottomTabScreenProps, createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { TabBar } from "components/navigation/TabBar";
import { defaultTabHeader } from "components/navigation/Header";
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import AntDesign from 'react-native-vector-icons/AntDesign'
import Entypo from 'react-native-vector-icons/Entypo'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { Timetable } from 'pages/timetable/TimetablePage';
import { Notes } from 'pages/notes/NotesPage';
import { Friends } from 'pages/friends/FriendsPage';
import { Profile } from 'pages/profile/ProfilePage';
import { Create } from 'pages/create/Create';
import { ID } from 'schema/database/abstract';
import { useTutorial } from 'providers/overlays/useTutorial';

type RouteData = {
  label: keyof RouteParams;
  icon: (color: string) => JSX.Element;
  root: (props: BottomTabScreenProps<RouteParams>) => JSX.Element;
}

export const routes: Record<keyof RouteParams, RouteData> = Object.freeze({
  "Timetable": {
    label: "Timetable",
    icon: (color: string) => <MaterialCommunityIcons name='calendar' size={28} color={color}/>,
    root: Timetable
  },
  "Notes": {
    label: "Notes",
    icon: (color: string) => <Entypo name='list' size={30} color={color} />,
    root: Notes
  },
  "Lyf": {
    label: "Lyf",
    icon: (color: string) => <AntDesign name='pluscircleo' size={35} color={color}/>,
    root: Create
  },
  "Friends": {
    label: "Friends",
    icon: (color: string) => <FontAwesome5 name="user-friends" size={25} color={color} />,
    root:  Friends
  },
  "Profile": {
    label: "Profile",
    icon: (color: string) => <FontAwesome5 name="user-alt" size={25} color={color} />,
    root: Profile
  }
});


export type RouteParams = {
  'Timetable': undefined,
  'Notes': { id?: ID },
  'Lyf': undefined,
  'Friends': undefined,
  'Profile': undefined
}

export default function Routes() {
  const { tutorialRoute } = useTutorial();
  const Tab = createBottomTabNavigator();

  return (
    <Tab.Navigator
      sceneContainerStyle={styles.aboveBackground}
      initialRouteName={tutorialRoute || 'Timetable'}
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