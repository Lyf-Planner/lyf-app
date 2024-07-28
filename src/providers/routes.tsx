import { NavigationContainer, NavigationProp } from '@react-navigation/native';
import { Dispatch, SetStateAction, createContext, useContext, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import AntDesign from 'react-native-vector-icons/AntDesign'
import Entypo from 'react-native-vector-icons/Entypo'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { Timetable } from 'pages/timetable/TimetablePage';
import { Notes } from 'pages/notes/NotesPage';
import { Friends } from 'pages/friends/FriendsPage';
import { Profile } from 'pages/profile/ProfilePage';

type Props = {
  children: JSX.Element;
}

export const routes = Object.freeze({
  "Timetable": {
    label: "Timetable",
    icon: (color: string) => <MaterialCommunityIcons name='calendar' size={30} color={color}/>,
    root: Timetable
  },
  "Notes": {
    label: "Notes",
    icon: (color: string) => <Entypo name='list' size={30} color={color} />,
    root: Notes
  },
  "New Plan": {
    label: "New Plan",
    icon: (color: string) => <AntDesign name='pluscircleo' size={40} color={color}/>,
    root: Timetable
  },
  "Friends": {
    label: "Friends",
    icon: (color: string) => <FontAwesome5 name="user-friends" size={27} color={color} />,
    root:  Friends
  },
  "Profile": {
    label: "Profile",
    icon: (color: string) => <FontAwesome5 name="user-alt" size={25} color={color} />,
    root: Profile
  }
});

export type PageNames = keyof typeof routes // type these manually
export type RootStackParamList = Record<PageNames[number], undefined>;
export type StackNavigation = NavigationProp<RootStackParamList>;

// Component provider
export const RouteProvider = ({ children }: Props) => {
  console.log('rendered route provider')

  return (
    <NavigationContainer>
      {children}
    </NavigationContainer>
  );
};

