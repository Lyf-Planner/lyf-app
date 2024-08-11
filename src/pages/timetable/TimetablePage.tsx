import { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { useTimetable } from 'providers/cloud/useTimetable';
import { deepBlue, primaryGreen, sun, white } from 'utils/colours';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { Calendar } from './Calendar';
import { Routine } from './Routine';
import { PageBackground } from 'components/general/PageBackground';
 
const Tab = createMaterialTopTabNavigator();

export const Timetable = () => {
  const { reload } = useTimetable();

  useEffect(() => {
    reload();
  }, [])

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
            tabBarIcon: () => <MaterialCommunityIcons name="table" size={24} color="white" />,
            tabBarLabel: "Calendar",
          }}
        />
        <Tab.Screen 
          name="Routine" 
          component={Routine}
          options={{
            tabBarIcon: () =>  <MaterialCommunityIcons name="refresh" size={24} color="white" style={{ top: 1 }} />,
            tabBarLabel: "Routine"
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
    flexDirection: "row"
  },
  tabBarStyle: {
    backgroundColor: primaryGreen, 
    shadowColor: 'black',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 2
  },
  tabBarIndicatorStyle: {
    backgroundColor: deepBlue
  }
});
