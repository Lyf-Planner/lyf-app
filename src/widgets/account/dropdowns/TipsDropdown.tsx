import { View, Text, StyleSheet } from "react-native";
import { SettingDropdown } from "../../../components/SettingDropdown";
import { SettingsDropdowns } from "../AccountDropdowns";

const TIPS = [
  "Hold down any task or event to delete it",
  "Swipe left on any task or event to enter Edit Mode",
  "Use Edit Mode to move items between lists",
  "Add items to Routine which you do every week",
  "Press the date at the top of each week to hide the contents of the week",
  "Press the name of a day to hide it (e.g. Monday)",
];

export const TipsDropdown = ({ settingOpen, setOpen }) => {
  return (
    <SettingDropdown
      name="Tips"
      touchableHightlightExtraStyles={{ paddingLeft: 2 }}
      boldTitle
      isBottom
      open={settingOpen === SettingsDropdowns.Tips}
      onPress={() => setOpen(SettingsDropdowns.Tips)}
    >
      <View style={styles.dropdownContent}>
        {TIPS.map((x) => (
          <BulletedText>
            <Text style={styles.tipText}>{x}</Text>
          </BulletedText>
        ))}
      </View>
    </SettingDropdown>
  );
};

const BulletedText = ({ children }) => {
  return (
    <View style={styles.bulletTextWrapper}>
      <Text style={styles.bullet}>{`\u25CF`}</Text>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  tipText: {
    fontSize: 15,
  },
  dropdownContent: {
    flexDirection: "column",
    gap: 8,
    paddingRight: 6,
    marginVertical: 4,
  },
  bullet: { width: 15, fontSize: 10 },
  bulletTextWrapper: { flexDirection: "row", alignItems: "center" },
});
