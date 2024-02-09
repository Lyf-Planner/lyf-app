import { View, StyleSheet } from "react-native";
import { LogoutButton } from "./buttons/LogoutButton";
import { DeleteButton } from "./buttons/DeleteMeButton";
import { AccountInfo } from "./profile/AccountInfo";
import { NotificationSettings } from "./notifications/Notifications";
import { SettingDropdown } from "../../components/dropdowns/SettingDropdown";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import FontAwesome from "react-native-vector-icons/FontAwesome";

export const AccountWidget = ({ logout, deleteMe }) => {
  return (
    <View style={styles.widgetContainer}>
      <View style={{ flexDirection: "column", marginBottom: 8 }}>
        <SettingDropdown
          name="My Profile"
          icon={<FontAwesome name="user" size={22} style={{ left: 2 }} />}
        >
          <AccountInfo />
        </SettingDropdown>
        <SettingDropdown
          name="Notification Settings"
          icon={<MaterialIcons name="notifications-active" size={22} />}
        >
          <NotificationSettings />
        </SettingDropdown>
      </View>
      <View style={styles.buttons}>
        <LogoutButton logout={logout} />
        <DeleteButton logout={logout} deleteMe={deleteMe} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  widgetContainer: {
    flexDirection: "column",
    flex: 1,
    gap: 4,
    paddingHorizontal: 16,
    marginTop: 2,
    minHeight: 500,
  },
  buttons: {
    flexDirection: "column",
    gap: 8,
    marginTop: "auto",
  },
});
