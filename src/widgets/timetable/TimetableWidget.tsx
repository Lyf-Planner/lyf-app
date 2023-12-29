import { View, Text, StyleSheet } from "react-native";
import { Planner } from "./Planner";
import { ListDropdown } from "../../components/dropdowns/ListDropdown";
import { ListType } from "../../components/list/ListInput";
import { ListItemType } from "../../components/list/constants";
import { Loader } from "../../components/MiscComponents";
import { useItems } from "../../hooks/useItems";

export const Timetable = () => {
  const { initialised, items } = useItems();

  if (!initialised) {
    return (
      <View
        style={{
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 20,
          marginVertical: 30,
        }}
      >
        <Loader size={60} />
        <Text style={{ fontSize: 18 }}>Organising your timetable...</Text>
      </View>
    );
  } else
    return (
      <View style={styles.widgetContainer}>
        <View style={styles.miscListContainer}>
          <ListDropdown
            items={items.filter(
              (x) => x.type === ListItemType.Event && !x.date && !x.day
            )}
            name="Upcoming Events"
            listType={ListType.Event}
          />
          <ListDropdown
            items={items.filter(
              (x) => x.type === ListItemType.Task && !x.date && !x.day
            )}
            name="To Do List"
            listType={ListType.Task}
          />
        </View>
        <Planner items={items.filter((x) => x.date || x.day)} />
      </View>
    );
};

const styles = StyleSheet.create({
  widgetContainer: {
    flexDirection: "column",
    marginTop: 10,
    flex: 1,
    gap: 2,
  },
  miscListContainer: {
    flexDirection: "column",
    gap: 6,
    marginHorizontal: 14,
    backgroundColor: "rgba(0,0,0,0.05)",
    marginTop: 2,
    marginBottom: 6,
    borderRadius: 10,
  },
});
