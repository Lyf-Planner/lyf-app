import { DaysOfWeek } from "../../utils/constants";
import { ListInput } from "./list/ListInput";
import { formatDate } from "../../utils/dates";
import { useState } from "react";
import {
  Pressable,
  StyleSheet,
  View,
  Text,
  TouchableHighlight,
} from "react-native";
import { Horizontal } from "../../components/MiscComponents";

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
      <Horizontal style={{ marginTop: 8, borderWidth: 2, opacity: 0.6 }} />
      {hasDates && (
        <View>
          <View style={styles.weekDateDisplayContainer}>
            <TouchableHighlight
              underlayColor="rgba(0,0,0,0.5)"
              style={styles.weekDatePressable}
              onPress={() => updateHide(!hide)}
              disabled={!hasDates}
            >
              <Text style={styles.weekDateText}>
                {formatDate(week.Monday.date)} - {formatDate(week.Sunday.date)}
              </Text>
            </TouchableHighlight>
            {hasHiddenDays() && !hide && (
              <TouchableHighlight
                style={styles.showAllPressable}
                onPress={() => showAllDays()}

              >
                <Text style={styles.showAllText}>Show All</Text>
              </TouchableHighlight>
            )}
          </View>
          <Horizontal
            style={{ marginBottom: 2, borderWidth: 2, opacity: 0.6 }}
          />
        </View>
      )}
      {!hide && (
        <View style={styles.weekDaysWrapperView}>
          {Object.values(DaysOfWeek).map((x) => (
            <Day
              key={x}
              dayData={week[x] || newDay(x)}
              updateDay={(dayData: any) => updateDay(x, dayData)}
            />
          ))}
        </View>
      )}
    </View>
  );
};

export const Day = ({ dayData, updateDay }: any) => {
  const updateEvents = (events: string[]) => updateDay({ ...dayData, events });
  const updateTasks = (tasks: string[]) => updateDay({ ...dayData, tasks });
  const updateMetadata = (metadata: string) =>
    updateDay({ ...dayData, metadata });
  const hideDay = () => updateDay({ ...dayData, hidden: true });

  if (dayData.hidden) return null;

  return (
    <View style={styles.dayRootView}>
      <View style={styles.dayHeaderView}>
        <TouchableHighlight
          onPress={hideDay}
          style={styles.dayOfWeekPressable}
          underlayColor="rgba(0,0,0,0.5)"
        >
          <Text style={styles.dayOfWeekText}>{dayData.day}</Text>
        </TouchableHighlight>

        <Text style={styles.dayDateText}>
          {dayData.date && formatDate(dayData.date)}
          {/* Should add a preferred format selection! */}
        </Text>
      </View>
      <View style={styles.listWrapperView}>
        <ListInput
          list={dayData.events || []}
          updateList={updateEvents}
          badgeColor="rgb(191 219 254)"
          placeholder="Add Event +"
          listBackgroundColor="black"
          isEvents
        />
      </View>

      <Horizontal
        style={{ borderColor: "rgba(255,255,255,0.5)", marginTop: 6 }}
      />

      <View style={styles.listWrapperView}>
        <ListInput
          list={dayData.tasks || []}
          updateList={updateTasks}
          badgeColor="rgb(241 245 249)"
          placeholder="Add Task +"
          listBackgroundColor="black"
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  weekDateDisplayContainer: {
    flexDirection: "row",
    paddingVertical: 7,
    paddingHorizontal: 2,
    alignItems: "center",
    justifyContent: "center",
  
  },
  weekDatePressable: {
    borderRadius: 10,
    marginVertical: 6,
  },
  weekDateText: {
    fontWeight: "600",
    fontSize: 18,
    padding: 2,
  },
  showAllPressable: {
    backgroundColor: "rgb(21, 128, 61)",
    marginLeft: "auto",
    paddingVertical: 6,
    paddingHorizontal: 8,
    borderRadius: 5,
    borderWidth: 0.5,
  },
  showAllText: {
    color: "white",
    fontSize: 15,
  },
  weekDaysWrapperView: {
    flexDirection: "column",
    gap: 8,
    marginTop: 8,
  },
  dayRootView: {
    backgroundColor: "black",
    width: "100%",
    borderRadius: 10,
    padding: 10,
    elavation: 1,
    zIndex: 10,
    flexDirection: "column",
  },
  dayHeaderView: {
    backgroundColor: "rgb(34 197 94)",
    borderRadius: 10,
    flexDirection: "row",
    paddingVertical: 4,
    paddingHorizontal: 6,
    alignItems: "center",
  },
  dayDateText: {
    marginLeft: "auto",
    paddingHorizontal: 2,
    fontSize: 16,
  },
  dayOfWeekText: {
    fontWeight: "600",
    fontSize: 18,
  },
  dayOfWeekPressable: {
    borderRadius: 10,
    paddingHorizontal: 2,
    paddingVertical: 6,
  },
  listWrapperView: {
    flexDirection: "column",
  },
  listTopicText: {
    color: "white",
    fontSize: 16,
    fontWeight: "500",
  },
});
