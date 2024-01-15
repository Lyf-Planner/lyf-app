import {
  dateFromDay,
  dayFromDateString,
  formatDate,
  formatDateData,
  getStartOfCurrentWeek,
  parseDateString,
} from "../../utils/dates";
import { useMemo, useState } from "react";
import { StyleSheet, View, Text } from "react-native";
import { Day } from "./DayDisplay";
import { BouncyPressable } from "../../components/BouncyPressable";
import { localisedMoment } from "../../utils/dates";
import { useAuth } from "../../authorisation/AuthProvider";
import { isTemplate } from "../../components/list/constants";
import { v4 as uuid } from "uuid";
import { deepBlue } from "../../utils/constants";

export const WeekDisplay = ({ items, dates, isFirst = false }) => {
  const [hide, updateHide] = useState(false);
  const { user, updateUser } = useAuth();
  const start = formatDateData(
    getStartOfCurrentWeek(parseDateString(dates[0]))
  );

  const unshiftFirst = async () => {
    var first = user.timetable.first_day || formatDateData(new Date());
    var prev = formatDateData(
      localisedMoment(parseDateString(first)).add(-1, "day").toDate()
    );
    if (prev.localeCompare(start) >= 0)
      updateUser({
        ...user,
        timetable: { ...user.timetable, first_day: prev },
      });
  };

  const exposedItems = (x) => {
    const instantiated_routines = x
      .filter((x) => x.template_id)
      .map((x) => x.template_id);

    return x
      .filter(
        // Filter out template who already have instantiations
        (x) => !(isTemplate(x) && instantiated_routines.includes(x.id))
      )
      .map((x) => {
        // Instantiate all the templates as their own item
        // Will only be pushed to db if user edits them
        if (isTemplate(x)) {
          return {
            ...x,
            id: uuid(),
            date: dateFromDay(x.day, dates),
            day: null,
            template_id: x.id,
            localised: true,
          };
        } else return x;
      });
  };

  const exposed = useMemo<any>(() => exposedItems(items), [items]);

  return (
    <View
      style={[
        styles.weekWrapper,
        {
          paddingBottom: hide && 12,
        },
      ]}
    >
      <BouncyPressable
        style={styles.weekDateDisplayTouchable}
        onPress={() => updateHide(!hide)}
        onLongPress={() => unshiftFirst()}
      >
        <View style={styles.weekDateDisplayContainer}>
          <View style={styles.weekDatePressable}>
            <Text style={styles.weekDateText}>
              {formatDate(start)} - {formatDate(dates[dates.length - 1])}
            </Text>
          </View>
        </View>
      </BouncyPressable>

      {!hide && exposed && (
        <View style={styles.weekDaysWrapperView}>
          {dates.map((x) => {
            const day = dayFromDateString(x);
            return (
              <Day
                key={x}
                date={x}
                items={exposed.filter((y) => y.date === x || y.day === day)}
              />
            );
          })}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  weekWrapper: {
    marginHorizontal: 16,
    marginTop: 16,
    marginBottom: 8,
    borderRadius: 10,
    backgroundColor: "rgba(0,0,0,0.1)",
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
    marginTop: 16,
    marginHorizontal: 12,
    backgroundColor: "rgba(0,0,0,0.2)",
    borderRadius: 10,
  },
  weekDatePressable: {
    borderRadius: 10,
    marginVertical: 6,
    flexDirection: "column",
  },
  weekDateText: {
    fontWeight: "600",
    color: deepBlue,
    fontSize: 20,
    fontFamily: "InterSemi",
  },
  weekDaysWrapperView: {
    flexDirection: "column",
    gap: 16,
    marginTop: 16,

    shadowColor: "black",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 3,
  },
});
