import { StyleSheet, Text, View } from "react-native";
import { eventsBadgeColor } from "../../../utils/constants";
import { UserAction } from "./UserActions";
import FontAwesome from "react-native-vector-icons/FontAwesome";

export const UserBanner = ({ user }) => {
  return (
    <View style={styles.main}>
      <FontAwesome name="user" size={24} />
      {user.name ? (
        <View style={{ flexDirection: "row" }}>
          <Text style={styles.mainAliasText}>{user.name}</Text>
          <Text style={styles.subAliasText}>{user.id}</Text>
        </View>
      ) : (
        <Text style={styles.mainAliasText}>{user.id}</Text>
      )}

      <View style={styles.actionWrapper}>
        <UserAction user_id={user.id} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  main: {
    flexDirection: "row",
    width: "100%",
    alignItems: "center",
    height: 70,
    gap: 8,
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: eventsBadgeColor,
    borderRadius: 10,
  },
  actionWrapper: { marginLeft: "auto", width: 150 },
  mainAliasText: { fontSize: 22, fontWeight: "500" },
  subAliasText: { fontSize: 14, color: "rgba(0,0,0,0.5)" },
});
