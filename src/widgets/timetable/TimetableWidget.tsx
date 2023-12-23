import { View, Text, StyleSheet } from "react-native";
import { Planner } from "./Planner";
import { Horizontal } from "../../components/MiscComponents";
import { ListDropdown } from "../../components/dropdowns/ListDropdown";
import { ListType } from "../../components/list/ListInput";

export const Timetable = ({ timetable, updateTimetable }: any) => {
  const updateUpcoming = (upcoming: any) =>
    updateTimetable({ ...timetable, upcoming });
  const updateTodo = (todo: any) => updateTimetable({ ...timetable, todo });
  const updateWeeks = (weeks: any) => updateTimetable({ ...timetable, weeks });
  const updateTemplates = (templates: any) =>
    updateTimetable({ ...timetable, templates });

  return (
    <View style={styles.widgetContainer}>
      <View style={styles.miscListContainer}>
        <ListDropdown
          list={timetable.upcoming || []}
          updateList={updateUpcoming}
          name="Upcoming Events"
          listType={ListType.Event}
        />
        <ListDropdown
          list={timetable.todo || []}
          updateList={updateTodo}
          name="To Do List"
          listType={ListType.Task}
        />
      </View>
      <Planner
        weeks={timetable.weeks}
        updateWeeks={updateWeeks}
        templates={timetable.templates}
        updateTemplates={updateTemplates}
      />
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
