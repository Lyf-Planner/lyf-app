import { BottomTabScreenProps, createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import AntDesign from 'react-native-vector-icons/AntDesign'
import Entypo from 'react-native-vector-icons/Entypo'
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import { defaultTabHeader } from '@/components/Header';
import { TabBar } from '@/containers/TabBar';
import { Create } from '@/pages/Create';
import { Friends } from '@/pages/Friends';
import { Notes } from '@/pages/Notes';
import { Profile } from '@/pages/Profile';
import { Timetable } from '@/pages/Timetable';
import { ID } from '@/schema/database/abstract';
import { useTutorial } from '@/shell/useTutorial';

type RouteData = {
  label: keyof RouteParams;
  icon: (color: string) => JSX.Element;
  root: (props: BottomTabScreenProps<RouteParams>) => JSX.Element;
}

export const routes: Record<keyof RouteParams, RouteData> = Object.freeze({
  Timetable: {
    label: 'Timetable',
    icon: (color: string) => <MaterialCommunityIcons name='calendar' size={25} color={color}/>,
    root: Timetable
  },
  Notes: {
    label: 'Notes',
    icon: (color: string) => <Entypo name='list' size={25} color={color} />,
    root: Notes
  },
  Lyf: {
    label: 'Lyf',
    icon: (color: string) => <AntDesign name='pluscircleo' size={35} color={color}/>,
    root: Create
  },
  Friends: {
    label: 'Friends',
    icon: (color: string) => <FontAwesome5 name="user-friends" size={25} color={color} />,
    root: Friends
  },
  Profile: {
    label: 'Profile',
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
      initialRouteName={tutorialRoute || 'Timetable'}
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

