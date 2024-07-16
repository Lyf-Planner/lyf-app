import Entypo from 'react-native-vector-icons/Entypo';

import { BouncyPressable } from "components/pressables/BouncyPressable";
import * as Native from 'react-native';
import { primaryGreen, secondaryGreen } from "utils/colours";
import { addWeekToStringDate, daysDifferenceBetween, formatDate, formatDateData, localisedMoment } from 'utils/dates';
import { DateString } from 'schema/util/dates';

type CalendarProps = {
  updateDisplayedDays: (start: DateString, end: DateString) => void;
  startDate: string;
  endDate: string;
}

enum ShiftDirection {
  BACK = -1,
  FORWARD = 1
}

export const CalendarRange = ({ updateDisplayedDays, startDate, endDate }: CalendarProps) => {
  // const dateOptions = useMemo(() => [
  //   { start: addWeekToStringDate(startDate, -1), end: addWeekToStringDate(endDate, -1) },
  //   { start: startDate, end: endDate },
  //   { start: addWeekToStringDate(startDate), end: addWeekToStringDate(endDate) },
  // ], [startDate, endDate]);

  const shift = (direction: ShiftDirection) => {
    const range = daysDifferenceBetween(startDate, endDate);
    const newStart = formatDateData(localisedMoment(startDate).add(direction * range, 'days').toDate())
    const newEnd = formatDateData(localisedMoment(endDate).add(direction * range, 'days').toDate())

    updateDisplayedDays(newStart, newEnd);
  }

  return (
    <BouncyPressable
      style={styles.weekDateDisplayTouchable}
    >
      <Native.TouchableOpacity onPress={() => shift(ShiftDirection.BACK)}>
        <Entypo name="chevron-left" color="white" size={25} />
      </Native.TouchableOpacity>
      <Native.Text style={styles.weekDateText}>
        {formatDate(startDate)} - {formatDate(endDate)}
      </Native.Text>
      <Native.TouchableOpacity onPress={() => shift(ShiftDirection.FORWARD)}>
        <Entypo name="chevron-right" color="white" size={25} />
      </Native.TouchableOpacity>
    </BouncyPressable>
  );
}


const styles = Native.StyleSheet.create({
  weekDateDisplayTouchable: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 14,
    borderWidth: 1,
    borderRadius: 10,
    backgroundColor: primaryGreen,

    shadowColor: 'black',
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2
  },
  weekDateText: {
    color: 'white',
    fontSize: 20,
    fontFamily: 'Lexend',
  },
})
