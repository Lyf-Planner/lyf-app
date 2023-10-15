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
        style,
      ]}
    />
  );
};

export const LoadingScreen = ({ text }) => {
  return (
    <View style={styles.loadingContainer}>
      <Progress.Circle color={"black"} size={50} indeterminate />
      <Text>{text}</Text>
    </View>
  );
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
