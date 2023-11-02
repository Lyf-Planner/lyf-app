import { View, Text, StyleSheet, TouchableHighlight } from "react-native";
import { SaveInfo } from "./SaveInfo";
import { LogoutButton } from "./LogoutButton";
import { DeleteButton } from "./DeleteMeButton";
import { Horizontal } from "../../components/MiscComponents";

export const AccountWidget = ({ logout, deleteMe, lastSave, lastUpdate }) => {
  return (
    <View style={styles.widgetContainer}>
      <SaveInfo lastSave={lastSave} lastUpdate={lastUpdate} />
      {/* <TipsSection /> */}
      <Horizontal style={{ borderColor: "rgba(0,0,0,0.2)", marginBottom: 8 }} />
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
    paddingHorizontal: 4,
  },
});
