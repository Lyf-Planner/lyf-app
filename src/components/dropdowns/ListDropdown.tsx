import { useEffect, useState } from "react";
import { Pressable, StyleSheet, View, Text } from "react-native";
import { ListInput } from "../list/ListInput";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  FadeIn,
  Easing,
  ZoomIn,
} from "react-native-reanimated";
import { eventsBadgeColor } from "../../utils/constants";
import Entypo from "react-native-vector-icons/Entypo";

const HIDDEN_HEIGHT = 52.5;

export const ListDropdown = ({ name, list, updateList, listType }: any) => {
  const [hide, updateHide] = useState(true);

  const chevronAngle = useSharedValue(0);
  const scale = useSharedValue(1);
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
  const scaleAnimation = useAnimatedStyle(() => {
    return {
      transform: [
        {
          scale: withTiming(scale.value, {
            duration: 100,
          }),
        },
      ],
    } as any;
  });

  useEffect(() => {
    chevronAngle.value = hide ? 0 : 90;
    if (hide) scale.value = 1;
  }, [hide]);

  return (
    <Animated.View style={[scaleAnimation]}>
      <Pressable
        onPress={() => updateHide(!hide)}
        onPressIn={() => (scale.value = 1.01)}
        style={styles.dropdownContainer}
      >
        <View style={styles.dropdownTextContainer}>
          <Text style={styles.listTitle}>{name}</Text>
          <Animated.View style={[styles.animatedChevron, rotationAnimation]}>
            <Entypo name={"chevron-right"} size={25} />
          </Animated.View>
        </View>
        {!hide && (
          <Animated.View
            style={styles.listWrapper}
            entering={FadeIn.duration(200)}
          >
            <ListInput
              list={list}
              updateList={updateList}
              badgeColor="rgb(30 41 59)"
              badgeTextColor="rgb(203 213 225)"
              listBackgroundColor={eventsBadgeColor}
              placeholder={`Add ${listType} +`}
              isEvents
            />
          </Animated.View>
        )}
      </Pressable>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  dropdownContainer: {
    flexDirection: "column",
    backgroundColor: eventsBadgeColor,
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 10,
    justifyContent: "flex-start",
    marginVertical: 1,
    borderWidth: 2,
    borderColor: "rgba(0, 0, 0, 0.1)",
  },
  dropdownTextContainer: {
    flexDirection: "row",
    width: "100%",
    alignItems: "center",
  },
  listTitle: {
    fontWeight: "500",
    fontSize: 20,
  },
  animatedChevron: {
    marginLeft: "auto",
    marginRight: 5,
  },
  listWrapper: {
    flexDirection: "column",
    overflow: "hidden",
    marginTop: 2,
  },
});
