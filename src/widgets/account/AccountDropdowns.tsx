import { View } from "react-native";
import { TipsDropdown } from "./dropdowns/TipsDropdown";
import { Horizontal } from "../../components/MiscComponents";
import { ProfileDropdown } from "./dropdowns/ProfileDropdown";
import { SaveDropdown } from "./dropdowns/SaveDropdown";

export const AccountDropdowns = () => {
  return (
    <View>
      <ProfileDropdown />
      <SaveDropdown />
      <TipsDropdown />
    </View>
  );
};
