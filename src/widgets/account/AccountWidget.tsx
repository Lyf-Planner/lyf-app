import moment from "moment";
import {
  View,
  Text,
  StyleSheet,
  TouchableHighlight,
  Alert,
} from "react-native";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import AntDesign from "react-native-vector-icons/AntDesign";
import { Horizontal } from "../../components/MiscComponents";

export const AccountWidget = ({ logout, deleteMe, lastSave, lastUpdate }) => {
  return (
    <View style={styles.widgetContainer}>
      <View
        style={{
          flexDirection: "column",
          marginBottom: 8,
          marginTop: 4,
          paddingHorizontal: 2,
          gap: 4,
        }}
      >
        <View style={styles.savedRow}>
          <Text style={styles.savedText}>
            {lastSave >= lastUpdate ? "Saved" : "Saving.."}
          </Text>
          <AntDesign
            name="checkcircle"
            style={{
              color: lastSave >= lastUpdate ? "green" : "orange",
              marginRight: 8,
            }}
            size={20}
          />
        </View>
        <View style={styles.lastSaveRow}>
          <View style={styles.lastSaveColumn}>
            <Text style={styles.lastSaveText}>Last Cloud Save:</Text>
            <Text style={styles.lastSaveText}>Last Local Change:</Text>
          </View>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
            <View style={styles.lastSaveTimeColumn}>
              <Text style={styles.lastSaveTime}>
                {moment(lastSave).format("hh:mm:ss A")}
              </Text>
              <Text style={styles.lastSaveTime}>
                {moment(lastUpdate).format("hh:mm:ss A")}
              </Text>
            </View>
          </View>
        </View>
      </View>
      <Horizontal style={{ borderColor: "rgba(0,0,0,0.2)", marginBottom: 8 }} />
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
  savedRow: { flexDirection: "row", alignItems: "center", gap: 4 },
  savedText: {
    fontWeight: "700",
    fontSize: 22,
  },
  lastSaveRow: {
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
  },
  lastSaveColumn: {
    flexDirection: "column",
    marginRight: "auto",
    gap: 2,
    alignItems: "flex-start",
  },
  lastSaveTimeColumn: {
    flexDirection: "column",
    marginRight: "auto",
    gap: 2,
    alignItems: "flex-end",
    marginLeft: "auto",
  },
  lastSaveText: {
    fontSize: 15,
    fontWeight: "400",
    textAlign: "center",
  },
  note: {
    fontSize: 12
  },
  lastSaveTime: {
    fontSize: 15,
    fontWeight: "400",
    textAlign: "right",
  },
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
