import { useState } from "react";
import { Pressable, StyleSheet, View, Text } from "react-native";
import { ListInput } from "../../components/List";
import Entypo from "react-native-vector-icons/Entypo";

export const ToDo = ({ todo, updateTodo }: any) => {
  const [hide, updateHide] = useState(true);

  return (
    <View style={styles.todoContainer}>
      <Pressable
        style={styles.todoTextContainer}
        onPress={() => updateHide(!hide)}
      >
        <Text style={styles.todoText}>To Do List</Text>
        {hide ? (
          <Entypo
            name="chevron-right"
            size={25}
            style={styles.icon}
            color={"black"}
          />
        ) : (
          <Entypo
            name="chevron-down"
            size={25}
            style={styles.icon}
            color={"black"}
          />
        )}
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
    paddingBottom: 2,
  },
  todoTextContainer: {
    flexDirection: "row",
    width: "100%",
    alignItems: "center",
  },
  todoText: {
    fontWeight: "500",
    fontSize: 18,
  },
  icon: {
    marginLeft: "auto",
    marginRight: 4,
  },
  listWrapper: {
    flexDirection: "column",
  },
});
