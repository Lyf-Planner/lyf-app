import { View, StyleSheet } from "react-native";
import { Planner } from "./Planner";
import { ListDropdown } from "../../components/dropdowns/ListDropdown";
import { ListType } from "../../components/list/ListInput";
import { ListItemType } from "../../components/list/constants";
import { useItems } from "../../hooks/useItems";
import Entypo from "react-native-vector-icons/Entypo";

export const Timetable = () => {
  const { items } = useItems();

  return (
    <View style={styles.widgetContainer}>
      <View style={styles.miscListContainer}>
        <ListDropdown
          items={items.filter(
            (x) => x.type === ListItemType.Event && !x.date && !x.day
          )}
          name="Upcoming Events"
          // @ts-ignore
          icon={<Entypo name="calendar" size={22} />}
          listType={ListType.Event}
        />
        <ListDropdown
          items={items.filter(
            (x) => x.type === ListItemType.Task && !x.date && !x.day
          )}
          name="To Do List"
          // @ts-ignore
          icon={<Entypo name="list" size={22} />}
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
    marginTop: 2,
    marginBottom: 6,
    borderRadius: 10,
  },
});
