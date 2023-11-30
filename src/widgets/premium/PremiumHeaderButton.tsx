import { StyleSheet, TouchableHighlight } from "react-native";

import { useAuth } from "../../authorisation/AuthProvider";
import { useModal } from "../../components/modal/ModalProvider";
import { PremiumSettingsModal } from "./PremiumSettingsModal";
import { PremiumAdvertiseModal } from "./PremiumAdvertiseModal";
import { PremiumIcon } from "../../components/Icons";

export const PremiumHeaderButton = () => {
  const { data } = useAuth();
  const { updateModal } = useModal();
  const premiumEnabled = data.premium?.enabled;

  return (
    <TouchableHighlight
      underlayColor={"rgba(0,0,0,0.4)"}
      style={[
        styles.premiumTooltip,
        {
          backgroundColor: premiumEnabled
            ? "rgba(0, 0, 0,0.95)"
            : "rgba(0,0,50,0.03)",
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
