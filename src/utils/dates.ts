import moment from "moment";
import { DaysList } from "./constants";

export function mapDatesToWeek(week: any, weekStart?: Date) {
  var date = weekStart ?? new Date();

  // First day of week is Monday
  moment.updateLocale("en", {
    week: {
      dow: 1,
    },
  });

  for (var i in DaysList) {
    var start = moment(getStartOfCurrentWeek(date));
    var next = start.add(i, "days").toDate();

    week[DaysList[i]].date = formatDateData(next);
  }
  return week;
}

export function getStartOfCurrentWeek(date?: Date) {
  var now = date ?? new Date();

  // This sets the first day of the week to Monday. For some reason not a default
  moment.updateLocale("en", {
    week: {
      dow: 1,
    },
  });

  var start = moment(now).startOf("week").toDate().setHours(0, 0, 0, 0);
  return new Date(start).toISOString();
}

export function formatDate(date: string) {
  var time = parseDateString(date);
  return moment(time).format("Do MMM");
}

export function formatDateData(date: Date) {
  return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
}

export function parseDateString(date: String) {
  var data = date.split("-").map((x) => parseInt(x));
  return new Date(data[0], data[1] - 1, data[2]);
}
