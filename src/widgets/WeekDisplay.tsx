import { DaysOfWeek } from "../utils/constants";
import { ListInput } from "../components/List";
import { formatDate } from "../utils/dates";
import { useState } from "react";
import { View } from "react-native";

export const WeekDisplay = ({ week, updateWeek, hasDates = false }: any) => {
  const [hide, updateHide] = useState(false);
  const updateDay = (day: DaysOfWeek, dayData: any) => {
    var weekData = week;
    weekData[day] = dayData;
    updateWeek(weekData);
  };

  const newDay = (day: DaysOfWeek) => {
    return {
      day,
      events: [],
      tasks: [],
      metadata: "",
    };
  };

  const showAllDays = () => {
    var newWeek = week;
    for (var day of Object.values(newWeek) as any) day.hidden = false;
    updateWeek(newWeek);
  };

  const hasHiddenDays = () => {
    for (var day of Object.values(week) as any) {
      if (day.hidden) return true;
    }
    return false;
  };

  return (
    <View>
      {hasDates && (
        <View>
          <div className="flex flex-row">
            <button
              className="text-lg font-semibold ml-2 hover:underline mr-auto"
              onClick={() => updateHide(!hide)}
            >
              {formatDate(week.Monday.date)} - {formatDate(week.Sunday.date)}
            </button>
            {hasHiddenDays() && (
              <button
                className="ml-auto bg-green-700 border border-black px-3 py-1 rounded-xl text-white"
                onClick={() => showAllDays()}
              >
                Show All
              </button>
            )}
          </div>
          <hr className={!hide ? "border-dashed" : ""} />
        </View>
      )}
      {!hide && (
        <div className="flex flex-col gap-2 border-r-1 w-full">
          {Object.values(DaysOfWeek).map((x) => (
            <Day
              key={x}
              dayData={week[x] || newDay(x)}
              updateDay={(dayData: any) => updateDay(x, dayData)}
            />
          ))}
        </div>
      )}
      <hr className="" />
    </View>
  );
};

export const Day = ({ dayData, updateDay }: any) => {
  const updateEvents = (events: string[]) => updateDay({ ...dayData, events });
  const updateTasks = (tasks: string[]) => updateDay({ ...dayData, tasks });
  const updateMetadata = (metadata: string) =>
    updateDay({ ...dayData, metadata });
  const hideDay = () => updateDay({ ...dayData, hidden: true });

  const itemsInRow = useMediaQuery({ query: "(min-width: 400px)" });

  if (dayData.hidden) return null;

  return (
    <div className="bg-black py-4 rounded-xl w-full">
      <div className="mx-4 flex flex-col gap-2">
        <div className="flex flex-row gap-2 bg-green-500 p-2 rounded-xl w-full">
          <button className="font-bold" onClick={() => hideDay()}>
            <p className="hover:underline">{dayData.day}</p>
          </button>
          <input
            type="text"
            className="bg-green-500 w-full"
            value={dayData.metadata}
            onChange={(e) => updateMetadata(e.target.value)}
          />
          <div className="ml-auto mr-2 whitespace-nowrap">
            {dayData.date && formatDate(dayData.date)}
            {/* Should add a preferred format selection! */}
          </div>
        </div>
        <div className={`flex ${itemsInRow ? "flex-row" : "flex-col"} gap-2`}>
          <div className="text-white p-1 w-20 mx-0">Events:</div>

          <ListInput
            list={dayData.events || []}
            updateList={updateEvents}
            badgeColor="bg-blue-200"
            placeholder="New Event +"
            isEvents
          />
        </div>
        <hr className="border-gray-700" />
        <div className={`flex ${itemsInRow ? "flex-row" : "flex-col"} gap-2`}>
          <div className="text-white p-1 w-20">Tasks:</div>
          <ListInput
            list={dayData.tasks || []}
            updateList={updateTasks}
            badgeColor="bg-slate-100"
            placeholder="New Task +"
          />
        </div>
      </div>
    </div>
  );
};
