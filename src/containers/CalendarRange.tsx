import { useCallback, useMemo, useState } from 'react';
import { TouchableOpacity, Text, StyleSheet, View } from 'react-native';

import { Calendar } from 'react-native-calendars';
import Entypo from 'react-native-vector-icons/Entypo';

import { LyfPopup, MenuPopoverPlacement } from '@/containers/LyfPopup';
import { DateString, WeekDays } from '@/schema/util/dates';
import { useTimetableStore } from '@/store/useTimetableStore';
import { black, primaryGreen, primaryGreenWithOpacity } from '@/utils/colours';
import { allDatesBetween, formatDate, formatDateData, localisedMoment } from '@/utils/dates';

enum ShiftDirection {
  BACK = -1,
  FORWARD = 1
}

type Props = {
  color?: string;
  textColor?: string;
}

export const CalendarRange = ({ color, textColor }: Props) => {
  const { reload, startDate, endDate } = useTimetableStore();

  const [selectedRange, setSelectedRange] = useState([startDate, endDate]);

  const shiftByWeek = (direction: ShiftDirection) => {
    const newStart = formatDateData(localisedMoment(startDate).add(direction * WeekDays.length, 'days').toDate())
    const newEnd = formatDateData(localisedMoment(endDate).add(direction * WeekDays.length, 'days').toDate())

    reload(newStart, newEnd);
  }

  const onDatePressed = ({ dateString }) => {
    const startDate = selectedRange[0];
    const endDate = selectedRange[1];

    if (dateString.localeCompare(startDate) < 0 || dateString.localeCompare(endDate) === 0) {
      setSelectedRange([dateString, dateString]);
    } else {
      setSelectedRange([startDate, dateString]);
    }
  }

  const onSubmitRange = () => {
    reload(...selectedRange);
  }

  const markedDates = useMemo(() => {
    const dateRange = allDatesBetween(selectedRange[0], selectedRange[1]);
    const markedDates: Record<DateString, object> = {};

    dateRange.forEach((date, i) => {
      const isStartOrEnd = i === 0 || i === dateRange.length - 1;

      markedDates[date] = {
        startingDay: i === 0,
        endingDay: i === dateRange.length - 1,
        selected: true,
        color: isStartOrEnd ? primaryGreen : primaryGreenWithOpacity(0.5),
        customContainerStyle: { width: '100%' }
      }
    });

    return markedDates;
  }, [selectedRange]);

  return (
    <LyfPopup
      name="calendar"
      placement={MenuPopoverPlacement.Bottom}
      onClose={onSubmitRange}
      popupContent={(
        <View style={styles.popupWrapper}>
          <Calendar
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
        // onLongPress={() => {
        //   reload(
        //     formatDateData(getStartOfCurrentWeek()),
        //     formatDateData(getEndOfCurrentWeek())
        //   )
        // }}
      >
        <TouchableOpacity onPress={() => shiftByWeek(ShiftDirection.BACK)} style={styles.arrowTouchable}>
          <Entypo name="chevron-left" color={textColor} size={30} />
        </TouchableOpacity>
        <Text style={[styles.weekDateText, { color: textColor }]}>
          {formatDate(startDate, true)} - {formatDate(endDate, true)}
        </Text>
        <TouchableOpacity onPress={() => shiftByWeek(ShiftDirection.FORWARD)} style={styles.arrowTouchable}>
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
    flexDirection: 'column',
    padding: 2,
    width: 275
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
