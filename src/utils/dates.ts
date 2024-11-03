import moment from 'moment';
import { User } from 'schema/user';
import { DateString, DayOfWeek, TimeString, WeekDays } from 'schema/util/dates';

// Wrapper to configure moment function
export const localisedMoment = (args?: moment.MomentInput) => {
  // This sets the first day of the week to Monday. For some reason not a default
  moment.updateLocale('en', {
    week: {
      dow: 1
    }
  });

  return moment(args);
};

export const localisedFormattedMoment = (args?: moment.MomentInput, format?: string) => {
  // This sets the first day of the week to Monday. For some reason not a default
  moment.updateLocale('en', {
    week: {
      dow: 1
    }
  });

  return moment(args, format);
};

export function currentDateString() {
  return formatDateData(new Date());
}

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

export function addDayToStringDate(date: string, amount = 1) {
  return formatDateData(moment(date).add(amount, 'day').toDate());
}

export function addWeekToStringDate(date: string, amount = 1) {
  return formatDateData(moment(date).add(amount, 'week').toDate());
}

export const upcomingWeek = (date: DateString) => {
  const start = establishFirstDay(date);
  const end = formatDateData(localisedMoment(start).add(1, 'week').add(-1, 'day').toDate());

  return allDatesBetween(start, end);
};

export const allDatesBetween = (start: DateString, end: DateString, excludeFinal = false) => {
  // Note: is inclusive of both start and end date

  if (end.localeCompare(start) < 0) {
    return [];
  }

  const dates: string[] = [];
  let shiftingDate = start;
  while (shiftingDate.localeCompare(end) <= 0) {
    dates.push(shiftingDate);
    shiftingDate = formatDateData(localisedMoment(shiftingDate).add(1, 'day').toDate());
  }

  return dates;
}

export const daysDifferenceBetween = (start: DateString, end: DateString) => {
  const a = localisedMoment(start);
  const b = localisedMoment(end);
  // Add 1 <==> inclusive of the end
  return b.diff(a, 'days') + 1;
}

const establishFirstDay = (first_day: DateString) => {
  // Show the users' first day unless over a week old
  const oneWeekAgo = localisedMoment().add(-1, 'weeks').toDate();
  const startDate = parseDateString(first_day);

  if (startDate < oneWeekAgo) {
    return formatDateData(getStartOfCurrentWeek());
  }

  return first_day;
};

export const extendByWeek = (days: string[]) => {
  const lastDay = days[days.length - 1];
  const newEnd = formatDateData(localisedMoment(lastDay).add(1, 'week').toDate());

  return allDatesBetween(days[0], newEnd);
};

export const dateWithTime = (time: TimeString) => {
  const [hours, mins] = time.split(':');
  const date = new Date();
  date.setHours(parseInt(hours), parseInt(mins));

  return date;
}

export function formatDate(date: string, abbreviate = false) {
  const time = parseDateString(date);
  return localisedMoment(time).format(abbreviate ? 'MMM D' : 'MMMM D');
}

export function dateFromDay(day: DayOfWeek, dates: string[]) {
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

export function parseDateString(date: DateString) {
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
