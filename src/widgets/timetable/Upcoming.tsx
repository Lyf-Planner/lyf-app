import { useState } from "react";
import { Pressable, StyleSheet, View, Text } from "react-native";
import { ListInput } from "./list/ListInput";
import Entypo from "react-native-vector-icons/Entypo";

export const Upcoming = ({ upcoming, updateUpcoming }: any) => {
  const [hide, updateHide] = useState(true);

  return (
    <View style={styles.upcomingContainer}>
      <Pressable
        style={styles.upcomingTextContainer}
        onPress={() => updateHide(!hide)}
      >
        <Text style={styles.upcomingText}>Upcoming Events</Text>
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
            list={upcoming}
            updateList={updateUpcoming}
            badgeColor="rgb(30 41 59)"
            badgeTextColor="rgb(203 213 225)"
            placeholder="Add Event +"
            isEvents
          />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  upcomingContainer: {
    flexDirection: "column",
    paddingBottom: 2,
    paddingLeft: 2,
  },
  upcomingTextContainer: {
    flexDirection: "row",
    width: "100%",
    alignItems: "center",
  },
  upcomingText: {
    fontWeight: "500",
    fontSize: 20,
  },
  icon: {
    marginLeft: "auto",
    marginRight: 4,
  },
  listWrapper: {
    flexDirection: "column",
  },
});
