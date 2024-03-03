import { View, TouchableHighlight, Text, StyleSheet } from "react-native";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

export const LogoutButton = ({ logout }) => {
  return (
    <TouchableHighlight onPress={logout}>
      <View style={styles.buttonView}>
        <Text style={styles.logoutText}>Logout</Text>
        {/* 
          // @ts-ignore */}
        <MaterialCommunityIcons name="logout" size={18} />
      </View>
    </TouchableHighlight>
  );
};

const styles = StyleSheet.create({
  buttonView: {
    flexDirection: "row",
    justifyContent: "center",
    borderWidth: 0.5,
    padding: 10,
    alignItems: "center",
    gap: 4,
    borderRadius: 5,
  },
  logoutText: {
    fontSize: 18,
    fontWeight: "700",
  },
});
