import { View, StyleSheet } from 'react-native';

import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { RouteParams } from 'Routes';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

import { Calendar } from '@/pages/Timetable_Calendar';
import { Routine } from '@/pages/Timetable_Routine';
import { black, deepBlue, primaryGreen, white } from '@/utils/colours';

const Tab = createMaterialTopTabNavigator();

export const Timetable = (props: BottomTabScreenProps<RouteParams>) => {
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
          tabBarIndicatorStyle: styles.tabBarIndicatorStyle
        }}
        sceneContainerStyle={styles.sceneContainerStyle}
      >
        <Tab.Screen
          name="Calendar"
          component={Calendar}
          options={{
            tabBarIcon: () => <MaterialIcons name='event-note' size={25} color={white}/>,
            tabBarLabel: 'Calendar'
          }}
        />
        <Tab.Screen
          name="Routine"
          component={Routine}
          options={{
            tabBarIcon: () => <MaterialIcons name="event-repeat" size={24} color={white} />,
            tabBarLabel: 'Routines'
          }}
        />
      </Tab.Navigator>
    </View>
  );
};

const styles = StyleSheet.create({
  main: {
    flex: 1
  },
  sceneContainerStyle: {
    flex: 1,
    height: '100%'
  },
  tabBarIndicatorStyle: {
    backgroundColor: deepBlue
  },
  tabBarItemStyle: {
    flexDirection: 'row',
    gap: 4
  },
  tabBarLabelStyle: {
    color: white,
    fontFamily: 'Lexend',
    fontSize: 20,
    textTransform: 'none'
  },
  tabBarStyle: {
    backgroundColor: primaryGreen,
    flexDirection: 'column',
    height: 60,
    justifyContent: 'center',
    shadowColor: black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 2
  }
});
