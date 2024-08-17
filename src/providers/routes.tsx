import { NavigationContainer, NavigationProp } from '@react-navigation/native';

type Props = {
  children: JSX.Element;
}

// Component provider
export const RouteProvider = ({ children }: Props) => {
  return (
    <NavigationContainer>
      {children}
    </NavigationContainer>
  );
};

