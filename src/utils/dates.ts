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
  return new Date(start);
}

export function getEndOfCurrentWeek(date?: Date) {
  var now = date ?? new Date();

  // This sets the first day of the week to Monday. For some reason not a default
  moment.updateLocale("en", {
    week: {
      dow: 1,
    },
  });

  var end = moment(now).endOf("week").toDate().setHours(0, 0, 0, 0);
  return new Date(end);
}

export const initialiseDays = (first_day) => {
  // Show days from first_day, unless it is behind the start of the current week
  var today = new Date();
  today.setHours(0, 0, 0, 0);
  var start = first_day ? first_day : formatDateData(today);
  const startOfWeek = formatDateData(getStartOfCurrentWeek(today));

  // Always refresh to Monday at the start of each week
  if (start.localeCompare(startOfWeek) === -1) start = startOfWeek;

  const endOfCurrentWeek = getEndOfCurrentWeek();
  var initial = [[start]];
  var week = 0;
  var next = moment(start).add(1, "day").toDate();
  while (next.getTime() <= endOfCurrentWeek.getTime()) {
    if (next.getDay() === 1) {
      initial.push([formatDateData(next)]);
      week++;
    } else {
      initial[week].push(formatDateData(next));
    }

    next = moment(next).add(1, "day").toDate();
  }

  return initial;
};

export const extendByWeek = (weeks) => {
  var i = weeks.length - 1;
  var last = parseDateString(weeks[i].slice(-1));
  const endOfNextWeek = moment(last).add(1, "week").toDate();
  weeks.push([]);
  while (last.getTime() <= endOfNextWeek.getTime()) {
    weeks[i + 1].push(last);
  }

  return weeks;
};

export function formatDate(date: string) {
  var time = parseDateString(date);
  return moment(time).format("DD MMM");
}

export function dayFromDateString(date: string) {
  return moment(parseDateString(date)).format("dddd");
}

export function formatDateData(date: Date) {
  return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
}

export function parseDateString(date: String) {
  var data = date.split("-").map((x) => parseInt(x));
  return new Date(data[0], data[1] - 1, data[2]);
}

export function TwentyFourHourToAMPM(time: string) {
  var [hours, mins] = time.split(":");
  var h = parseInt(hours);
  return (h % 12 ? h % 12 : 12) + ":" + mins + (h >= 12 ? " PM" : " AM");
}
