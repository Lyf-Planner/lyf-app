import { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { useTimetable } from '../../providers/useTimetable';
import { black, primaryGreen, white } from 'utils/colours';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { Calendar } from './Calendar';
import { Routine } from './Routine';
 
const Tab = createMaterialTopTabNavigator();

export const Timetable = () => {
  const { loading, reload } = useTimetable();

  useEffect(() => {
    if (loading) {
      reload();
    }
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
      >
        <Tab.Screen 
          name="Calendar" 
          component={Calendar} 
          options={{
            tabBarIcon: () => <MaterialCommunityIcons name="table" size={24} color="white" />,
            tabBarLabel: "Calendar"
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
    flexDirection: 'column',
    flex: 1,
    gap: 2
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
    backgroundColor: black
  }
});
