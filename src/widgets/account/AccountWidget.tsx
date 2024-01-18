import { View, StyleSheet } from "react-native";
import { LogoutButton } from "./buttons/LogoutButton";
import { DeleteButton } from "./buttons/DeleteMeButton";
import { AccountDropdowns } from "./AccountDropdowns";

export const AccountWidget = ({ logout, deleteMe }) => {
  return (
    <View style={styles.widgetContainer}>
      <AccountDropdowns />
      <LogoutButton logout={logout} />
      <DeleteButton logout={logout} deleteMe={deleteMe} />
    </View>
  );
};

const styles = StyleSheet.create({
  widgetContainer: {
    flexDirection: "column",
    flex: 1,
    gap: 8,
    paddingHorizontal: 16,
    marginTop: 8,
  },
});
