import { View, StyleSheet, Text } from 'react-native';
import * as Progress from 'react-native-progress';

export const Horizontal = ({ style = {} }) => {
  return (
    <View
      style={[
        {
          borderBottomWidth: 0.5
        },
        style
      ]}
    />
  );
};

export const Vertical = ({ style = {} }) => {
  return (
    <View
      style={[
        {
          borderLeftWidth: 0.5
        },
        style
      ]}
    />
  );
};

export const LoadingScreen = ({ text }) => {
  return (
    <View style={styles.loadingContainer}>
      <Text style={{ color: 'white', fontSize: 16 }}>{text}</Text>
      <Loader color="white" size={60} />
    </View>
  );
};

export const Loader = ({ size = 50, color = 'black' }) => {
  return <Progress.Pie color={color} size={size} indeterminate />;
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    alignContent: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 25
  }
});
