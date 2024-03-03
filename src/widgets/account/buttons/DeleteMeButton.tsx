import {
  TouchableHighlight,
  View,
  Text,
  Alert,
  StyleSheet,
} from "react-native";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

export const DeleteButton = ({ deleteMe, logout }) => {
  return (
    <TouchableHighlight
      onPress={() => {
        Alert.prompt(
          "Confirm Deletion",
          "Please re-enter your password to confirm account deletion",
          async (pass) => {
            var success = await deleteMe(pass);
            if (success) logout();
          }
        );
      }}
    >
      <View style={[styles.buttonView, styles.deleteView]}>
        <Text style={styles.deleteText}>Delete Account</Text>
        {/* 
          // @ts-ignore */}
        <MaterialCommunityIcons name="delete-circle" size={20} />
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
  deleteText: {
    fontSize: 16,
  },
  deleteView: {
    backgroundColor: "red",
  },
});
