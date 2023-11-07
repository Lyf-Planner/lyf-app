import { useState } from "react";
import { StyleSheet, View, Text, Pressable } from "react-native";
import { TouchableHighlight } from "react-native-gesture-handler";
import Entypo from "react-native-vector-icons/Entypo";
import { Horizontal } from "./MiscComponents";

export const Dropdown = ({
  name,
  children,
  opacity = 1,
  boldTitle = false,
  extraStyles = {},
  touchableHightlightExtraStyles = {},
  isBottom = false,
}: any) => {
  const [open, setOpen] = useState(false);
  return (
    <View style={[styles.main, extraStyles]}>
      <TouchableHighlight
        style={[styles.touchableHighlight, touchableHightlightExtraStyles]}
        underlayColor={"rgba(0,0,0,0.3)"}
        onPress={() => setOpen(!open)}
      >
        <View style={[styles.pressableDropdown, { opacity }]}>
          <Text style={[styles.titleText, boldTitle && { fontWeight: "500" }]}>
            {name}
          </Text>
          <Entypo
            style={styles.dropdownOpenIndicator}
            name={open ? "chevron-down" : "chevron-right"}
            size={25}
          />
        </View>
      </TouchableHighlight>
      {open && (
        <View>
          <Horizontal style={{ marginTop: 6, marginBottom: 4, opacity: 0.4 }} />
          <View style={styles.dropdownContent}>{children}</View>
        </View>
      )}
      <Horizontal
        style={{
          opacity: open ? 0.4 : 0.1,
          marginTop: 6,
          marginBottom: 6,
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  main: {
    flexDirection: "column",
  },
  pressableDropdown: {
    flexDirection: "row",
    flex: 1,
    alignItems: "center",
    height: 35,
  },
  touchableHighlight: {
    borderRadius: 10,
    flexDirection: "row",
    alignItems: "center",
  },
  titleText: {
    fontSize: 20,
  },
  dropdownOpenIndicator: {
    marginLeft: "auto",
  },
  dropdownContent: {
    marginTop: 6,
    marginBottom: 6,
    paddingLeft: 4,
  },
});
