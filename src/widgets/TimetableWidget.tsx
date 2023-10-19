import { Upcoming } from "./Upcoming";
import { Planner } from "./Planner";
import { ToDo } from "./ToDo";

export const Timetable = ({ timetable, updateTimetable }: any) => {
  const updateUpcoming = (upcoming: any) =>
    updateTimetable({ ...timetable, upcoming });
  const updateTodo = (todo: any) => updateTimetable({ ...timetable, todo });
  const updateWeeks = (weeks: any) => updateTimetable({ ...timetable, weeks });
  const updateTemplates = (templates: any) =>
    updateTimetable({ ...timetable, templates });

  return (
    <div className="flex flex-col">
      <Upcoming
        upcoming={timetable.upcoming || []}
        updateUpcoming={updateUpcoming}
      />
      <hr className="mt-3 mb-3 border-dashed" />
      <ToDo todo={timetable.todo || []} updateTodo={updateTodo} />

      <hr className="my-3 rounded-3xl border-2 border-gray-700" />
      <Planner
        weeks={timetable.weeks}
        updateWeeks={updateWeeks}
        templates={timetable.templates}
        updateTemplates={updateTemplates}
      />
    </div>
  );
};
