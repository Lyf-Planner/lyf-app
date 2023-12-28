import moment from "moment";

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

export const initialiseDays = (user) => {
  const endOfCurrentWeek = getEndOfCurrentWeek();
  const start = establishFirstDay(user.timetable.first_day);

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
  const endOfNextWeek = moment(lastDay).add(1, "week").toDate();

  var next = moment(lastDay).add(1, "day").toDate();

  weeks.push([]);
  while (next.getTime() <= endOfNextWeek.getTime()) {
    weeks[i + 1].push(formatDateData(next));
    next = moment(next).add(1, "day").toDate();
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
