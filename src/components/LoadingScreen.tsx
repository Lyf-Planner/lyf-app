import { View, Text, StyleSheet } from "react-native";
import { Loader } from "components/Loader";

export const LoadingScreen = ({ text }: { text: string}) => {
  return (
    <View style={styles.loadingScreenContainer}>
      <Text style={{ color: 'white', fontSize: 16, fontFamily: "Lexend" }}>{text}</Text>
      <Loader color="white" size={60} />
    </View>
  );
};

const styles = StyleSheet.create({
  loadingScreenContainer: {
    flex: 1,
    alignContent: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 25
  },
});
