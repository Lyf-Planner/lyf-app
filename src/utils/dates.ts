import moment from "moment";
import { DaysOfWeek } from "./constants";

// Wrapper to configure moment function
export const localisedMoment = (args: any) => {
  // This sets the first day of the week to Monday. For some reason not a default
  moment.updateLocale("en", {
    week: {
      dow: 1,
    },
  });
  return moment(args);
};

export function getStartOfCurrentWeek(date?: Date) {
  var now = date ?? new Date();

  // This sets the first day of the week to Monday. For some reason not a default

  var start = localisedMoment(now)
    .startOf("week")
    .toDate()
    .setHours(0, 0, 0, 0);
  return new Date(start);
}

export function getEndOfCurrentWeek(date?: Date) {
  var now = date ?? new Date();

  var end = localisedMoment(now).endOf("week").toDate().setHours(0, 0, 0, 0);
  return new Date(end);
}

export const initialiseDays = (user) => {
  const endOfCurrentWeek = getEndOfCurrentWeek();
  const start = establishFirstDay(user.timetable.first_day);

  var initial = [[start]];
  var week = 0;
  var next = localisedMoment(start).add(1, "day").toDate();
  while (next.getTime() <= endOfCurrentWeek.getTime()) {
    if (next.getDay() === 1) {
      initial.push([formatDateData(next)]);
      week++;
    } else {
      initial[week].push(formatDateData(next));
    }

    next = localisedMoment(next).add(1, "day").toDate();
  }

  return initial;
};

const establishFirstDay = (first_day) => {
  // Show days from first_day onward, unless it is behind the start of the current week or ahead of current day
  var today = new Date();
  today.setHours(0, 0, 0, 0);
  var start = first_day ? first_day : formatDateData(today);
  const startOfWeek = formatDateData(getStartOfCurrentWeek(today));

  if (start.localeCompare(startOfWeek) < 0)
    // Always refresh to Monday at the start of each week
    start = startOfWeek;

  return start;
};

export const extendByWeek = (weeks) => {
  var i = weeks.length - 1;
  var lastWeek = weeks[i];
  var lastDay = lastWeek[lastWeek.length - 1];
  const endOfNextWeek = localisedMoment(lastDay).add(1, "week").toDate();

  var next = localisedMoment(lastDay).add(1, "day").toDate();

  weeks.push([]);
  while (next.getTime() <= endOfNextWeek.getTime()) {
    weeks[i + 1].push(formatDateData(next));
    next = localisedMoment(next).add(1, "day").toDate();
  }

  return weeks;
};

export function formatDate(date: string) {
  var time = parseDateString(date);
  return localisedMoment(time).format("DD MMM");
}

export function dateFromDay(day: DaysOfWeek, dates) {
  for (var date of dates) {
    if (localisedMoment(date).format("dddd") === day) return date;
  }
}

export function dayFromDateString(date: string) {
  return localisedMoment(parseDateString(date)).format("dddd");
}

export function formatDateData(date: Date) {
  return localisedMoment(date).format("YYYY-MM-DD");
}

export function parseDateString(date: String) {
  var data = date.split("-").map((x) => parseInt(x));
  return new Date(data[0], data[1] - 1, data[2]);
}

export function TwentyFourHourToAMPM(time: string) {
  var [hours, mins] = time.split(":");
  var h = parseInt(hours);
  return (h % 12 ? h % 12 : 12) + ":" + mins + (h >= 12 ? "pm" : "am");
}
