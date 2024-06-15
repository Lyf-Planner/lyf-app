import moment from 'moment';
import { DayOfWeek } from 'schema/util/dates';

// Wrapper to configure moment function
export const localisedMoment = (...args: any[]) => {
  // This sets the first day of the week to Monday. For some reason not a default
  moment.updateLocale('en', {
    week: {
      dow: 1
    }
  });
  return moment(args);
};

export function getStartOfCurrentWeek(date?: Date) {
  const now = date ?? new Date();

  // This sets the first day of the week to Monday. For some reason not a default

  const start = localisedMoment(now)
    .startOf('week')
    .toDate()
    .setHours(0, 0, 0, 0);
  return new Date(start);
}

export function getEndOfCurrentWeek(date?: Date) {
  const now = date ?? new Date();

  const end = localisedMoment(now).endOf('week').toDate().setHours(0, 0, 0, 0);
  return new Date(end);
}

export function addWeekToStringDate(date: string) {
  return formatDateData(moment(date).add(1, 'week').toDate());
}

export const initialiseDays = (user) => {
  const endOfCurrentWeek = getEndOfCurrentWeek();
  const start = establishFirstDay(user.timetable.first_day);

  const initial = [[start]];
  let week = 0;
  let next = localisedMoment(start).add(1, 'day').toDate();
  while (next.getTime() <= endOfCurrentWeek.getTime()) {
    if (next.getDay() === 1) {
      initial.push([formatDateData(next)]);
      week++;
    } else {
      initial[week].push(formatDateData(next));
    }

    next = localisedMoment(next).add(1, 'day').toDate();
  }

  return initial;
};

const establishFirstDay = (first_day) => {
  // Show days from first_day onward, unless it is behind the start of the current week or ahead of current day
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  let start = first_day ? first_day : formatDateData(today);
  const startOfWeek = formatDateData(getStartOfCurrentWeek(today));

  if (start.localeCompare(startOfWeek) < 0)
  // Always refresh to Monday at the start of each week
  {
    start = startOfWeek;
  }

  return start;
};

export const extendByWeek = (weeks) => {
  const i = weeks.length - 1;
  const lastWeek = weeks[i];
  const lastDay = lastWeek[lastWeek.length - 1];
  const endOfNextWeek = localisedMoment(lastDay).add(1, 'week').toDate();

  let next = localisedMoment(lastDay).add(1, 'day').toDate();

  weeks.push([]);
  while (next.getTime() <= endOfNextWeek.getTime()) {
    weeks[i + 1].push(formatDateData(next));
    next = localisedMoment(next).add(1, 'day').toDate();
  }

  return weeks;
};

export function formatDate(date: string) {
  const time = parseDateString(date);
  return localisedMoment(time).format('MMM D');
}

export function dateFromDay(day: DaysOfWeek, dates) {
  for (const date of dates) {
    if (localisedMoment(date).format('dddd') === day) {
      return date;
    }
  }
}

export function dayFromDateString(date: string) {
  return localisedMoment(parseDateString(date)).format('dddd');
}

export function formatDateData(date: Date) {
  return localisedMoment(date).format('YYYY-MM-DD');
}

export function parseDateString(date: string) {
  const data = date.split('-').map((x) => parseInt(x));
  return new Date(data[0], data[1] - 1, data[2]);
}

export function TwentyFourHourToAMPM(time: string, withAMPM = true) {
  const [hours, mins] = time.split(':');
  const h = parseInt(hours);
  const hourText = (h % 12 ? h % 12 : 12);
  const minsText = mins;
  const AMPM = withAMPM ? (h >= 12 ? 'pm' : 'am') : '';
  return `${hourText}:${minsText}${AMPM}`;
}

export function TwentyFourHourToRawAMPM(time: string) {
  const [hours] = time.split(':');
  const h = parseInt(hours);
  const AMPM = (h >= 12 ? 'pm' : 'am');
  return AMPM;
}
