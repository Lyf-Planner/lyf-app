import * as Native from 'react-native'
import { Tab } from "./Tab";
import { routes } from 'Routes';

const ENLARGED_TAB = 2;

export const TabBar = ({ state, navigation }: any) => {
  const conditionalStyles = {
    mainContainer: { paddingBottom: Native.Platform.OS === 'ios' ? 0 : 10 }
  }

  return (
    <Native.View
      style={[
        styles.mainContainer,
        conditionalStyles.mainContainer
      ]}
    >
      {state.routes.map((route: any, index: number) => {
        const routeDetails = routes[route.name as keyof typeof routes];
        const isFocused = state.index === index;

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        };

        return (
          <Tab 
            isFocused={isFocused}
            index={index}
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

    shadowColor: 'black',
    shadowOffset: { width: 0, height: -1 },
    shadowOpacity: 0.25,
    shadowRadius: 4
  }
});
