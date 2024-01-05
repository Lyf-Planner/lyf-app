import { View, Text, StyleSheet } from "react-native";
import { SettingDropdown } from "../../../components/dropdowns/SettingDropdown";
import { SettingsDropdowns } from "./constants";
import { BulletedText } from "../../../components/Text";

const TIPS = [
  "To modify details of any task or event, swipe it left!",
  "To automatically include items in each week, add them to your Routine",
  "To delete any task or event, hold it down",
  "To hide the contents of the week, press the button where it's dates are shown",
  "To hide a day, hold down it's green header section",
];

export const TipsDropdown = ({ settingOpen, setOpen }) => {
  return (
    <SettingDropdown
      name="Tips"
      touchableHightlightExtraStyles={{ paddingLeft: 2 }}
      boldTitle
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
