import { useEffect, useState } from "react";
import { Pressable, StyleSheet, View, Text } from "react-native";
import { ListInput } from "../../components/list/ListInput";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import Entypo from "react-native-vector-icons/Entypo";

export const ToDo = ({ todo, updateTodo }: any) => {
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
    <View style={styles.todoContainer}>
      <Pressable
        style={styles.todoTextContainer}
        onPress={() => updateHide(!hide)}
      >
        <Text style={styles.todoText}>To Do List</Text>
        <Animated.View style={[styles.animatedChevron, rotationAnimation]}>
          <Entypo name={"chevron-right"} size={25} />
        </Animated.View>
      </Pressable>
      {!hide && (
        <View style={styles.listWrapper}>
          <ListInput
            list={todo}
            updateList={updateTodo}
            badgeColor="rgb(30 41 59)"
            badgeTextColor="rgb(203 213 225)"
            placeholder="Add Task +"
            isEvents
          />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  todoContainer: {
    flexDirection: "column",
    alignItems: "center",
    paddingLeft: 2,
  },
  todoTextContainer: {
    flexDirection: "row",
    width: "100%",
    alignItems: "center",
  },
  todoText: {
    fontWeight: "500",
    fontSize: 20,
  },
  animatedChevron: {
    marginLeft: "auto",
    marginRight: 12,
  },
  listWrapper: {
    flexDirection: "column",
    marginTop: 2,
  },
});
