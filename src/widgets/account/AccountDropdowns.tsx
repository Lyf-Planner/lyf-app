import { View } from "react-native";
import { TipsDropdown } from "./dropdowns/TipsDropdown";
import { ProfileDropdown } from "./dropdowns/ProfileDropdown";
import { useState } from "react";
import { SettingsDropdowns } from "./dropdowns/constants";

export const AccountDropdowns = () => {
  const [openSetting, updateOpenSetting] = useState<any>("");

  const expandDropdown = (dropdown: SettingsDropdowns) => {
    openSetting === dropdown
      ? updateOpenSetting("")
      : updateOpenSetting(dropdown);
  };

  return (
    <View style={{ paddingHorizontal: 2 }}>
      <ProfileDropdown settingOpen={openSetting} setOpen={expandDropdown} />
      <TipsDropdown settingOpen={openSetting} setOpen={expandDropdown} />
    </View>
  );
};
