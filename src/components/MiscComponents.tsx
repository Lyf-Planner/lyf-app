import { View, StyleSheet, Text } from "react-native";
import * as Progress from "react-native-progress";

export const Horizontal = ({ style = {} }) => {
  return (
    <View
      style={[
        {
          borderBottomColor: "black",
          borderBottomWidth: 0.5,
        },
      ]}
    />
  );
};

export const LoadingScreen = ({ text }) => {
  return (
    <View style={styles.loadingContainer}>
      <Text>{text}</Text>
      <Loader />
    </View>
  );
};

export const Loader = ({ size = 50 }) => {
  return <Progress.Circle color={"black"} size={size} indeterminate />;
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    alignContent: "center",
    justifyContent: "center",
    alignItems: "center",
    gap: 25,
  },
});
