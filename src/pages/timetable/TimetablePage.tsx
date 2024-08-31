import { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { useTimetable } from 'providers/cloud/useTimetable';
import { deepBlue, primaryGreen, sun, white } from 'utils/colours';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { Calendar } from './Calendar';
import { Routine } from './Routine';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { RouteParams } from 'Routes';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
 
const Tab = createMaterialTopTabNavigator();

export const Timetable = (props: BottomTabScreenProps<RouteParams>) => {
  const { reload } = useTimetable();

  // useEffect(() => {
  //   reload();
  // }, [])

  return (
    <View style={styles.main}>
      <Tab.Navigator
        screenOptions={{
          swipeEnabled: false, // TODO: Enable this, to work in tandem with item swiping. This is really hard.
          tabBarBounces: true,
          tabBarPressOpacity: 0.75,
          tabBarLabelStyle: styles.tabBarLabelStyle,
          tabBarItemStyle: styles.tabBarItemStyle,
          tabBarStyle: styles.tabBarStyle,
          tabBarIndicatorStyle: styles.tabBarIndicatorStyle,
        }}
        sceneContainerStyle={{ flex : 1, height: '100%'}}
      >
        <Tab.Screen 
          name="Calendar" 
          component={Calendar} 
          options={{
            tabBarIcon: () => <MaterialIcons name='event-note' size={25} color={white}/>,
            tabBarLabel: "Calendar",
          }}
        />
        <Tab.Screen 
          name="Routine" 
          component={Routine}
          options={{
            tabBarIcon: () =>  <MaterialIcons name="event-repeat" size={24} color={white} />,
            tabBarLabel: "Routines"
          }}
        />
      </Tab.Navigator>
    </View>
  );
};

const styles = StyleSheet.create({
  main: {
    flex: 1,
  },
  tabBarLabelStyle: { 
    fontSize: 20, 
    color: white, 
    fontFamily: "Lexend", 
    textTransform: "none" 
  },
  tabBarItemStyle: {
    height: 65,
    flexDirection: "row",
    gap: 4
  },
  tabBarStyle: {
    backgroundColor: primaryGreen, 
    shadowColor: 'black',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 2,
    height: 65,
    flexDirection: 'column',
    justifyContent: 'center'
  },
  tabBarIndicatorStyle: {
    backgroundColor: deepBlue
  }
});
