import { DaysOfWeek, offWhite } from "../../utils/constants";
import { formatDate } from "../../utils/dates";
import { useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableHighlight,
  TouchableOpacity,
} from "react-native";
import { Day } from "./DayDisplay";
import { BouncyPressable } from "../../components/BouncyPressable";

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
    <View style={styles.weekWrapper}>
      {false && (
        <BouncyPressable
          style={styles.weekDateDisplayTouchable}
          onPress={() => updateHide(!hide)}
        >
          <View style={styles.weekDateDisplayContainer}>
            <View style={styles.weekDatePressable}>
              <Text style={styles.weekDateText}>
                {formatDate(week.Monday.date)} - {formatDate(week.Sunday.date)}
              </Text>
            </View>
            {hasHiddenDays() && !hide && (
              <BouncyPressable
                style={styles.showAllPressable}
                onPress={() => showAllDays()}
                containerStyle={{ marginLeft: "auto" }}
                useTouchableHighlight
              >
                <Text style={styles.showAllText}>Show All</Text>
              </BouncyPressable>
            )}
          </View>
        </BouncyPressable>
      )}
      {!hide && (
        <View style={styles.weekDaysWrapperView}>
          {Object.values(DaysOfWeek).map((x) => (
            <Day
              key={x}
              dayData={week[x] || newDay(x)}
              showDate={hasDates}
              updateDay={(dayData: any) => updateDay(x, dayData)}
            />
          ))}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  weekWrapper: {
    marginHorizontal: 16,
    marginTop: 15,
    marginBottom: 8,
    borderRadius: 10,
    backgroundColor: "rgba(0,0,0,0.05)",
  },
  weekDateDisplayContainer: {
    flexDirection: "row",
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 10,

    alignItems: "center",
    justifyContent: "center",
  },
  weekDateDisplayTouchable: {
    marginTop: 6,

    borderRadius: 10,
  },
  weekDatePressable: {
    borderRadius: 10,
    marginVertical: 6,
    flexDirection: "column",
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
    gap: 16,

    shadowColor: "black",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 3,
  },
});
