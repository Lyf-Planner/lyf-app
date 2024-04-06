import { useCallback } from "react";
import { View, StyleSheet } from "react-native";
import { Planner } from "./Planner";
import { ListDropdown } from "../../components/dropdowns/ListDropdown";
import { ListType } from "../../components/list/List";
import { ListItemType } from "../../components/list/constants";
import { useItems } from "../../hooks/useItems";
import Entypo from "react-native-vector-icons/Entypo";

export const Timetable = () => {
  const { items } = useItems();

  const filterUpcomingEvents = useCallback(() => {
    return items.filter(
      (x) =>
        x.type === ListItemType.Event &&
        ((!x.date && !x.day) || x.show_in_upcoming)
    );
  }, [items]);

  const filterToDoList = useCallback(() => {
    return items.filter(
      (x) =>
        x.type === ListItemType.Task &&
        ((!x.date && !x.day) || x.show_in_upcoming)
    );
  }, [items]);

  const filterScheduledItems = useCallback(() => {
    return items.filter((x) => x.date || x.day);
  }, [items]);

  return (
    <View style={styles.widgetContainer}>
      <View style={styles.miscListContainer}>
        <ListDropdown
          items={filterUpcomingEvents()}
          name="Upcoming Events"
          icon={<Entypo name="calendar" size={22} />}
          listType={ListType.Event}
        />
        <ListDropdown
          items={filterToDoList()}
          name="To Do List"
          icon={<Entypo name="list" size={22} />}
          listType={ListType.Task}
        />
      </View>
      <Planner items={filterScheduledItems()} />
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
    marginTop: 2,
    marginBottom: 6,
    borderRadius: 10,
  },
});
