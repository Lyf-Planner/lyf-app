import { StyleSheet, TouchableHighlight } from "react-native";
import { deepBlue } from "../../utils/constants";
import FontAwesome from "react-native-vector-icons/FontAwesome";

export const TutorialHeaderButton = ({ onPress, open }) => {
  return (
    <TouchableHighlight
      underlayColor={"rgba(0,0,0,0.4)"}
      style={[
        styles.wrapper,
        {
          backgroundColor: open ? deepBlue : "white",
        },
      ]}
      onPress={onPress}
    >
      <FontAwesome name="question" size={30} color={open ? "white" : "black"} />
    </TouchableHighlight>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
    width: 50,
    borderWidth: 0.5,
    borderColor: "rgba(0,0,0,0.1)",
    padding: 5,
    borderRadius: 100,
  },
});
