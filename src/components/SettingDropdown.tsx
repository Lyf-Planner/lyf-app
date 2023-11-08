import { useEffect } from "react";
import { StyleSheet, View, Text } from "react-native";
import { TouchableHighlight } from "react-native-gesture-handler";
import Entypo from "react-native-vector-icons/Entypo";
import { Horizontal } from "./MiscComponents";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

export const SettingDropdown = ({
  name,
  children,
  onPress,
  open = false,
  opacity = 1,
  boldTitle = false,
  extraStyles = {},
  touchableHightlightExtraStyles = {},
}: any) => {
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
    <View style={[styles.main, extraStyles]}>
      <TouchableHighlight
        style={[styles.touchableHighlight, touchableHightlightExtraStyles]}
        underlayColor={"rgba(0,0,0,0.3)"}
        onPress={onPress}
      >
        <View style={[styles.pressableDropdown, { opacity }]}>
          <Text style={[styles.titleText, boldTitle && { fontWeight: "500" }]}>
            {name}
          </Text>
          <Animated.View style={[styles.animatedChevron, rotationAnimation]}>
            <Entypo name={"chevron-right"} size={25} />
          </Animated.View>
        </View>
      </TouchableHighlight>
      {open && (
        <View>
          <Horizontal
            style={{
              marginTop: 6,
              marginBottom: 4,
              opacity: 0.4,
              borderBottomWidth: open ? 2 : 0.5,
            }}
          />
          <View style={styles.dropdownContent}>{children}</View>
        </View>
      )}
      <Horizontal
        style={{
          opacity: open ? 0.4 : 0.1,
          borderBottomWidth: open ? 2 : 0.5,
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

  animatedChevron: {
    marginLeft: "auto",
  },
  dropdownContent: {
    marginTop: 6,
    marginBottom: 6,
    paddingLeft: 4,
  },
});
