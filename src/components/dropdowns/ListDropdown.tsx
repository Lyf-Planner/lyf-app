import { useEffect, useState } from "react";
import { Pressable, StyleSheet, View, Text } from "react-native";
import { ListInput } from "../list/ListInput";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import Entypo from "react-native-vector-icons/Entypo";

export const ListDropdown = ({ name, list, updateList, listType }: any) => {
  const [hide, updateHide] = useState(true);

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
    chevronAngle.value = !hide ? 90 : 0;
  }, [hide]);

  return (
    <Pressable
      style={styles.dropdownContainer}
      onPress={() => updateHide(!hide)}
    >
      <View style={styles.dropdownTextContainer}>
        <Text style={styles.listTitle}>{name}</Text>
        <Animated.View style={[styles.animatedChevron, rotationAnimation]}>
          <Entypo name={"chevron-right"} size={25} />
        </Animated.View>
      </View>
      {!hide && (
        <View style={styles.listWrapper}>
          <ListInput
            list={list}
            updateList={updateList}
            badgeColor="rgb(30 41 59)"
            badgeTextColor="rgb(203 213 225)"
            placeholder={`Add ${listType} +`}
            isEvents
          />
        </View>
      )}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  dropdownContainer: {
    flexDirection: "column",
    paddingBottom: 2,
    marginVertical: 2,
    paddingLeft: 2,
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
    marginTop: 2,
  },
});
