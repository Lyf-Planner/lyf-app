import { Upcoming } from "./Upcoming";
import { View, Text, StyleSheet } from "react-native";
import { Planner } from "./Planner";
import { Horizontal } from "../components/MiscComponents";
import { ToDo } from "./ToDo";
// import { ToDo } from "./ToDo";

export const Timetable = ({ timetable, updateTimetable }: any) => {
  const updateUpcoming = (upcoming: any) =>
    updateTimetable({ ...timetable, upcoming });
  const updateTodo = (todo: any) => updateTimetable({ ...timetable, todo });
  const updateWeeks = (weeks: any) => updateTimetable({ ...timetable, weeks });
  const updateTemplates = (templates: any) =>
    updateTimetable({ ...timetable, templates });

  return (
    <View style={styles.widgetContainer}>
      <Upcoming
        upcoming={timetable.upcoming || []}
        updateUpcoming={updateUpcoming}
      />
      <Horizontal style={{ borderColor: "rgba(0,0,0,0.2)" }} />
      <ToDo todo={timetable.todo || []} updateTodo={updateTodo} />
      <Horizontal style={{ borderWidth: 4, borderRadius: 20 }} />

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
    flex: 1,
    gap: 8,
  },
});
