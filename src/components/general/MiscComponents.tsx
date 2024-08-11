import { View, StyleSheet, Text } from 'react-native';
import * as Progress from 'react-native-progress';
import { deepBlue } from 'utils/colours';

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

export const LoadingScreen = ({ text }: { text: string}) => {
  return (
    <View style={styles.loadingScreenContainer}>
      <Text style={{ color: 'white', fontSize: 16, fontFamily: "Lexend" }}>{text}</Text>
      <Loader color="white" size={60} />
    </View>
  );
};

export const Loader = ({ size = 50, color = 'black' }) => {
  return <Progress.Pie color={color} size={size} indeterminate />;
};

export const PageLoader = () => {
  return (
    <View style={styles.loadingContainer}>
      <Loader size={50} color={deepBlue} />
      <Text style={styles.loadingText}>
        Organizing...
      </Text>
    </View>
  )
}

const styles = StyleSheet.create({
  loadingScreenContainer: {
    flex: 1,
    alignContent: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 25
  },
  loadingContainer: {
    marginTop: 50,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10,
  },
  loadingText: {
    fontFamily: 'Lexend',
    fontSize: 20,
    color: deepBlue
  },
});
