import { useEffect, useState } from "react";
import { StyleSheet, View, Text } from "react-native";
import { TouchableHighlight } from "react-native-gesture-handler";
import { Horizontal } from "../MiscComponents";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import Entypo from "react-native-vector-icons/Entypo";

export const SettingDropdown = ({
  name,
  children,
  icon,
  startOpen = false,
  bgColor = null,
}) => {
  const [open, setOpen] = useState(startOpen);
  const chevronAngle = useSharedValue(0);
  const rotationAnimation = useAnimatedStyle(() => {
    return {
      transform: [
        {
          rotateZ: withTiming(`${chevronAngle.value}deg`, {
            duration: 200,
          }),
        },
      ],
    } as any;
  });

  useEffect(() => {
    chevronAngle.value = open ? 90 : 0;
  }, [open]);

  return (
    <View style={[styles.main]}>
      <TouchableHighlight
        style={[
          styles.touchableHighlight,
          { backgroundColor: bgColor || "white" },
        ]}
        underlayColor={"rgba(0,0,0,0.3)"}
        onPress={() => setOpen(!open)}
      >
        <View style={{ width: "100%" }}>
          <View style={[styles.pressableDropdown]}>
            <View style={{ width: 20 }}>{icon}</View>
            <Text style={[styles.titleText]}>{name}</Text>
            <Animated.View style={[styles.animatedChevron, rotationAnimation]}>
              <Entypo name={"chevron-right"} size={25} />
            </Animated.View>
          </View>
        </View>
      </TouchableHighlight>
      <Horizontal
        style={{
          borderWidth: 1,
          opacity: 0.2,
        }}
      />

      {open && (
        <View>
          <View style={styles.dropdownContent}>{children}</View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  main: {
    flexDirection: "column",
  },
  pressableDropdown: {
    flexDirection: "row",
    gap: 10,
    paddingHorizontal: 2,
    flex: 1,
    alignItems: "center",
  },
  touchableHighlight: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 8,
    height: 60,
  },
  titleText: {
    fontSize: 22,
    fontFamily: "InterMed",
  },

  animatedChevron: {
    marginLeft: "auto",
  },
  dropdownContent: {
    marginVertical: 8,
    paddingLeft: 4,
  },
});
