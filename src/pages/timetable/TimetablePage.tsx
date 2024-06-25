import { useCallback, useEffect, useMemo, useState } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { ListDropdown } from '../../components/dropdowns/ListDropdown';
import { useTimetable } from '../../providers/useTimetable';
import Entypo from 'react-native-vector-icons/Entypo';
import { ItemType } from 'schema/database/items';
import { ScrollView } from 'react-native-gesture-handler';
import { BouncyPressable } from 'components/pressables/BouncyPressable';
import { black, primaryGreen, secondaryGreen, white } from 'utils/colours';
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
