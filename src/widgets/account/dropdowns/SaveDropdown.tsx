import { View, Text, StyleSheet } from "react-native";
import { SettingDropdown } from "../../../components/dropdowns/SettingDropdown";
import { useAuth } from "../../../authorisation/AuthProvider";
import { SettingsDropdowns } from "./constants";
import { localisedMoment } from "../../../utils/dates";
import AntDesign from "react-native-vector-icons/AntDesign";

export const SaveDropdown = ({ settingOpen, setOpen }) => {
  return (
    <SettingDropdown
      name="Save Info"
      touchableHightlightExtraStyles={{ paddingLeft: 2 }}
      boldTitle
      open={settingOpen === SettingsDropdowns.Save}
      onPress={() => setOpen(SettingsDropdowns.Save)}
    >
      <SaveInfo />
    </SettingDropdown>
  );
};

export const SaveInfo = () => {
  const { lastSave, user } = useAuth();
  const lastUpdate = user.last_updated as Date;

  const saved = new Date(lastSave).getTime() > new Date(lastUpdate).getTime();

  return (
    <View style={styles.saveSection}>
      <View style={styles.savedRow}>
        <Text style={styles.savedText}>{saved ? "Saved" : "Saving.."}</Text>
        <AntDesign
          name="checkcircle"
          style={{
            color: saved ? "green" : "orange",
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
              {localisedMoment(lastSave).format("hh:mm:ss A")}
            </Text>
            <Text style={styles.lastSaveTime}>
              {localisedMoment(lastUpdate).format("hh:mm:ss A")}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  saveSection: {
    flexDirection: "column",
    marginBottom: 4,
    marginTop: 4,
    paddingHorizontal: 2,
    gap: 4,
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
  lastSaveTime: {
    fontSize: 15,
    fontWeight: "400",
    textAlign: "right",
  },
});
