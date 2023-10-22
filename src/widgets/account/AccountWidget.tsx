import moment from "moment";
import {
  View,
  Text,
  StyleSheet,
  TouchableHighlight,
  Alert,
} from "react-native";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

export const AccountWidget = ({ logout, deleteMe, lastSave, isSaving }) => {
  return (
    <View style={styles.widgetContainer}>
      <View style={styles.lastSaveRow}>
        <Text style={styles.lastSaveText}>
          Last Save: {moment(lastSave).format("hh:mm:ss A")}
        </Text>
      </View>
      <TouchableHighlight onPress={logout}>
        <View style={styles.buttonView}>
          <Text style={styles.logoutText}>Logout</Text>
          <MaterialCommunityIcons name="logout" size={18} />
        </View>
      </TouchableHighlight>
      <TouchableHighlight
        onPress={() => {
          Alert.prompt(
            "Confirm",
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
          <MaterialCommunityIcons name="delete-circle" size={20} />
        </View>
      </TouchableHighlight>
    </View>
  );
};

const styles = StyleSheet.create({
  widgetContainer: {
    flexDirection: "column",
    flex: 1,
    gap: 8,
    paddingHorizontal: 4,
  },
  lastSaveRow: {
    flexDirection: "row",
  },
  lastSaveText: {
    fontSize: 16,
    fontWeight: "500",
  },
  isSavingText: {},
  buttonView: {
    flexDirection: "row",
    justifyContent: "center",
    borderWidth: 0.5,
    padding: 10,
    alignItems: "center",
    gap: 4,
    borderRadius: 5
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
