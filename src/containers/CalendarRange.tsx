import { useCallback, useEffect, useMemo, useState } from 'react';
import { TouchableOpacity, Text, StyleSheet, View } from 'react-native';

import { Calendar, DateData } from 'react-native-calendars';
import Entypo from 'react-native-vector-icons/Entypo';

import { LyfPopup, MenuPopoverPlacement } from '@/containers/LyfPopup';
import { DateString } from '@/schema/util/dates';
import { useTimetableStore } from '@/store/useTimetableStore';
import { black, primaryGreen, primaryGreenWithOpacity } from '@/utils/colours';
import { addWeekToStringDate, allDatesBetween, currentDateString, formatDate, formatDateData, getEndOfCurrentWeek, getStartOfCurrentWeek, localisedMoment } from '@/utils/dates';
import { useAuthStore } from '@/store/useAuthStore';

enum ShiftDirection {
  BACK = -1,
  FORWARD = 1
}

type Props = {
  color?: string;
  textColor?: string;
}

export const CalendarRange = ({ color, textColor }: Props) => {
  const { user } = useAuthStore();
  const { reload, startDate, endDate } = useTimetableStore();

  const [selectedRange, setSelectedRange] = useState([startDate, endDate]);

  useEffect(() => {
    setSelectedRange([startDate, endDate]);
  }, [startDate, endDate])

  const shiftByRange = useCallback(
    (direction: ShiftDirection) => {
      const range = allDatesBetween(startDate, endDate).length;
      const newStart = formatDateData(localisedMoment(startDate).add(direction * range, 'days').toDate())
      const newEnd = formatDateData(localisedMoment(endDate).add(direction * range, 'days').toDate())

      reload(newStart, newEnd);
    },
    [startDate, endDate]
  )

  const onDatePressed = ({ dateString }: DateData) => {
    const startDate = selectedRange[0];
    const endDate = selectedRange[1];

    if (dateString.localeCompare(startDate) < 0 || dateString.localeCompare(endDate) === 0) {
      setSelectedRange([dateString, dateString]);
    } else {
      setSelectedRange([startDate, dateString]);
    }
  }

  const onSubmitRange = () => {
    if (selectedRange[0] !== startDate || selectedRange[1] !== endDate) {
      reload(...selectedRange);
    }
  }

  const markedDates = useMemo(() => {
    const dateRange = allDatesBetween(selectedRange[0], selectedRange[1]);
    const markedDates: Record<DateString, object> = {};

    markedDates[formatDateData(new Date())] = {
      marked: true
    }

    dateRange.forEach((date, i) => {
      const isStartingDay = i === 0;
      const isEndingDay = i === dateRange.length - 1;

      const isStartOfWeek = localisedMoment(date).weekday() === 0;
      const isEndOfWeek = localisedMoment(date).weekday() === 6;

      console.log('date', date, 'has weekday',localisedMoment(date).weekday(), { isStartingDay, isEndingDay, isStartOfWeek, isEndOfWeek });

      markedDates[date] = {
        startingDay: isStartingDay,
        endingDay: isEndingDay,
        selected: true,
        color: isStartingDay || isEndingDay ? primaryGreen : primaryGreenWithOpacity(0.5),
        customContainerStyle: {
          width: '100%'
        }
      }
    });

    return markedDates;
  }, [selectedRange]);

  return (
    <LyfPopup
      name="calendar"
      placement={MenuPopoverPlacement.Bottom}
      onLongPress={() => {
        // Move to the user's first day
        // Shift back by 1 if already on the starting day
        if (startDate === user?.first_day) {
          reload(
            formatDateData(localisedMoment(user?.first_day).add(-1, 'day').toDate()),
            addWeekToStringDate(user?.first_day || currentDateString())
          )
        } else {
          reload(
            user?.first_day,
            addWeekToStringDate(user?.first_day || currentDateString())
          )
        }
      }}
      onClose={onSubmitRange}
      popupContent={(
        <View style={styles.popupWrapper}>
          <Calendar
            current={startDate}
            firstDay={1}
            onDayPress={onDatePressed}
            enableSwipeMonths
            markedDates={markedDates}
            markingType='period'
            theme={{
              arrowColor: black,
              textMonthFontFamily: 'Lexend',
              textMonthFontWeight: '500',
              textDayFontFamily: 'Lexend',
              textDayFontWeight: '400',
              textDayHeaderFontFamily: 'Lexend'
            }}
          />
        </View>
      )}
    >
      <View
        style={[styles.weekDateDisplayTouchable, { backgroundColor: color }]}
      >
        <TouchableOpacity onPress={() => shiftByRange(ShiftDirection.BACK)} style={styles.arrowTouchable}>
          <Entypo name="chevron-left" color={textColor} size={30} />
        </TouchableOpacity>
        <Text style={[styles.weekDateText, { color: textColor }]}>
          {formatDate(startDate, true)} - {formatDate(endDate, true)}
        </Text>
        <TouchableOpacity onPress={() => shiftByRange(ShiftDirection.FORWARD)} style={styles.arrowTouchable}>
          <Entypo name="chevron-right" color={textColor} size={30} />
        </TouchableOpacity>
      </View>
    </LyfPopup>
  );
}

const styles = StyleSheet.create({
  arrowTouchable: {
    paddingHorizontal: 4
  },

  popupWrapper: {
    alignItems: 'center',
    alignSelf: 'center',
    flexDirection: 'column',
    paddingHorizontal: 8
  },

  weekDateDisplayTouchable: {
    alignItems: 'center',
    borderRadius: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 14,
    paddingVertical: 12
  },
  weekDateText: {
    fontFamily: 'Lexend',
    fontSize: 20
  }
})
