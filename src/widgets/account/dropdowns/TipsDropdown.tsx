import { View, Text, StyleSheet } from "react-native";
import { SettingDropdown } from "../../../components/dropdowns/SettingDropdown";
import { SettingsDropdowns } from "../AccountDropdowns";

const TIPS = [
  "To delete any task or event, hold down on the item",
  "To enter Edit Mode, swipe left on any task, event or list item",
  "Use Edit Mode to move items between days or lists",
  "To automatically include tasks/events in each week, add them to your Routine",
  "To hide the contents of the week, press the button where it's dates are shown",
  "To hide a day, hold down it's green header section",
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
