import { StyleSheet, TouchableHighlight } from "react-native";
import { useAuth } from "../../authorisation/AuthProvider";
import { useModal } from "../../hooks/useModal";
import { PremiumSettingsModal } from "./PremiumSettingsModal";
import { PremiumAdvertiseModal } from "./PremiumAdvertiseModal";
import { PremiumIcon } from "../../components/Icons";
import { deepBlue } from "../../utils/constants";

export const PremiumHeaderButton = () => {
  const { user } = useAuth();
  const { modal, updateModal } = useModal();
  const premiumEnabled = user.premium?.enabled;

  return (
    <TouchableHighlight
      underlayColor={"rgba(0,0,0,0.4)"}
      style={[
        styles.premiumTooltip,
        {
          backgroundColor: !!modal ? deepBlue : "white",
        },
      ]}
      onPress={() =>
        premiumEnabled
          ? updateModal(<PremiumSettingsModal />)
          : updateModal(<PremiumAdvertiseModal />)
      }
    >
      <PremiumIcon />
    </TouchableHighlight>
  );
};

const styles = StyleSheet.create({
  premiumTooltip: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
    width: 50,
    borderWidth: 0.5,
    borderColor: "rgba(0,0,0,0.1)",
    marginLeft: "auto",
    padding: 5,
    borderRadius: 100,
  },
});
