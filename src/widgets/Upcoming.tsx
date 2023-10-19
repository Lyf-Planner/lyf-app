import { useState } from "react";
import { Pressable, StyleSheet, View, Text } from "react-native";

export const Upcoming = ({ upcoming, updateUpcoming }: any) => {
  const [hide, updateHide] = useState(true);

  return (
    <View style={{}}>
      <Pressable
        style={styles.upcomingTextContainer}
        onPress={() => updateHide(!hide)}
      >
        <Text style={styles.upcomingText}>Upcoming Events</Text>
        {/* {hide ? (
          <FaChevronCircleRight className="my-auto ml-auto mr-4" />
        ) : (
          <FaChevronCircleDown className="my-auto ml-auto mr-4" />
        )} */}
      </Pressable>
      {/* {!hide && (
        <div className="flex flex-col gap-2">
          <ListInput
            list={upcoming}
            updateList={updateUpcoming}
            badgeColor="bg-slate-900"
            badgeTextColor="text-slate-300"
            placeholder="Add Event +"
            isEvents
          />
        </div>
      )} */}
    </View>
  );
};

const styles = StyleSheet.create({
  upcomingContainer: {
    flexDirection: "column",
    gap: 4,
  },
  upcomingTextContainer: {
    flexDirection: "row",
  },
  upcomingText: {
    fontWeight: "bold",
    fontSize: 18,
  },
});
