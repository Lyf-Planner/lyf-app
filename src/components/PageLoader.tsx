import { View, StyleSheet, Text } from "react-native";
import { Loader } from "components/Loader";
import { deepBlue } from "utils/colours";

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
