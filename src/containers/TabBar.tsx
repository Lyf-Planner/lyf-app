import * as Native from 'react-native'
import { Tab } from "components/Tab";
import { routes } from 'Routes';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';

export const TabBar = ({ state, navigation }: BottomTabBarProps) => {
  return (
    <Native.View style={styles.mainContainer}>
      {state.routes.map((route, index: number) => {
        const routeDetails = routes[route.name as keyof typeof routes];
        const isFocused = state.index === index;

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        };

        return (
          <Tab 
            isFocused={isFocused}
            index={index}
            key={index}
            onPress={onPress}
            route={routeDetails}
          />
        )
      })}
    </Native.View>
  );
  
};

const styles = Native.StyleSheet.create({
  mainContainer: {
    flexDirection: 'row',
    position: 'absolute',
    bottom: 0,
    width: '100%',
    height: 65, // This doesn't actually effect the height, but for some reason fixes the shadow on web

    shadowColor: 'black',
    shadowOffset: { width: 0, height: -1 },
    shadowOpacity: 0.25,
    shadowRadius: 4
  }
});
