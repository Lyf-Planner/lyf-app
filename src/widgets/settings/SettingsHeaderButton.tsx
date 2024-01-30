import { StyleSheet, TouchableHighlight } from "react-native";
import { useModal } from "../../hooks/useModal";
import { SettingsModal } from "./SettingsModal";
import { deepBlue } from "../../utils/constants";
import Feather from "react-native-vector-icons/Feather";

export const SettingsHeaderButton = () => {
  const { modal, updateModal } = useModal();

  return (
    <TouchableHighlight
      underlayColor={"rgba(0,0,0,0.4)"}
      style={[
        styles.premiumTooltip,
        {
          backgroundColor: !!modal ? deepBlue : "white",
        },
      ]}
      onPress={() => updateModal(<SettingsModal />)}
    >
      <Feather name="settings" size={30} />
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
