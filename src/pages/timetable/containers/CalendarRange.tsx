import Entypo from 'react-native-vector-icons/Entypo';

import { BouncyPressable } from "components/pressables/BouncyPressable";
import * as Native from 'react-native';
import { primaryGreen, secondaryGreen, white } from "utils/colours";
import { addWeekToStringDate, daysDifferenceBetween, formatDate, formatDateData, getEndOfCurrentWeek, getStartOfCurrentWeek, localisedMoment } from 'utils/dates';
import { DateString, WeekDays } from 'schema/util/dates';
import { useTimetable } from 'providers/cloud/useTimetable';

enum ShiftDirection {
  BACK = -1,
  FORWARD = 1
}

type Props = {
  color?: string;
  textColor?: string;
}

export const CalendarRange = ({ color = primaryGreen, textColor = white }: Props) => {
  const { reload, startDate, endDate } = useTimetable();

  const shift = (direction: ShiftDirection) => {
    const newStart = formatDateData(localisedMoment(startDate).add(direction * WeekDays.length, 'days').toDate())
    const newEnd = formatDateData(localisedMoment(endDate).add(direction * WeekDays.length, 'days').toDate())

    reload(newStart, newEnd);
  }

  return (
    <BouncyPressable
      style={[styles.weekDateDisplayTouchable, { backgroundColor: color }]}
      onLongPress={() => reload(
        formatDateData(getStartOfCurrentWeek()),
        formatDateData(getEndOfCurrentWeek())
      )}
    >
      <Native.TouchableOpacity onPress={() => shift(ShiftDirection.BACK)}>
        <Entypo name="chevron-left" color={textColor} size={25} />
      </Native.TouchableOpacity>
      <Native.Text style={[styles.weekDateText, { color: textColor }]}>
        {formatDate(startDate)} - {formatDate(endDate)}
      </Native.Text>
      <Native.TouchableOpacity onPress={() => shift(ShiftDirection.FORWARD)}>
        <Entypo name="chevron-right" color={textColor} size={25} />
      </Native.TouchableOpacity>
    </BouncyPressable>
  );
}


const styles = Native.StyleSheet.create({
  weekDateDisplayTouchable: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderRadius: 10,

    shadowColor: 'black',
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2
  },
  weekDateText: {
    fontSize: 19,
    fontFamily: 'Lexend',
  },
})
