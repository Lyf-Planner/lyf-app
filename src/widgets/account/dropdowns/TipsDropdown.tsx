import { View, Text, StyleSheet } from "react-native";
import { SettingDropdown } from "../../../components/dropdowns/SettingDropdown";
import { SettingsDropdowns } from "../AccountDropdowns";
import { BulletedText } from "../../../components/Text";

const TIPS = [
  "To automatically include tasks/events in each week, add them to your Routine",
  "To delete any task or event, hold down on the item",
  "To hide the contents of the week, press the button where it's dates are shown",
  "To hide a day, hold down it's green header section",
  "With Premium, swipe an event or task left to plan in greater detail"
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

const styles = StyleSheet.create({
  tipText: {
    fontSize: 15,
  },
  dropdownContent: {
    flexDirection: "column",
    gap: 8,
    paddingRight: 12,
    marginVertical: 4,
  },
});
