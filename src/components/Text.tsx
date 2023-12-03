import { View, Text, StyleSheet } from "react-native";

export const BulletedText = ({ children }) => {
  return (
    <View style={styles.bulletTextWrapper}>
      <Text style={styles.bullet}>{`\u25CF`}</Text>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  bullet: {
    width: 15,
    fontSize: 10,
    marginTop: 3,
    textAlignVertical: "center",
  },
  bulletTextWrapper: { flexDirection: "row", alignItems: "flex-start" },
});
