import * as Native from 'react-native';

import { BouncyPressable } from 'components/BouncyPressable';
import { useAuth } from 'hooks/cloud/useAuth';
import { useTimetable } from 'hooks/cloud/useTimetable';
import Entypo from 'react-native-vector-icons/Entypo';
import { WeekDays } from 'schema/util/dates';
import { formatDate, formatDateData, getEndOfCurrentWeek, getStartOfCurrentWeek, localisedMoment } from 'utils/dates';

enum ShiftDirection {
  BACK = -1,
  FORWARD = 1
}

type Props = {
  color?: string;
  textColor?: string;
}

export const CalendarRange = ({ color, textColor }: Props) => {
  const { reload, startDate, endDate } = useTimetable();
  const { updateUser } = useAuth();

  const shift = (direction: ShiftDirection) => {
    const newStart = formatDateData(localisedMoment(startDate).add(direction * WeekDays.length, 'days').toDate())
    const newEnd = formatDateData(localisedMoment(endDate).add(direction * WeekDays.length, 'days').toDate())

    reload(newStart, newEnd);
  }

  return (
    <BouncyPressable
      style={[styles.weekDateDisplayTouchable, { backgroundColor: color }]}
      onLongPress={() => {
        reload(
          formatDateData(getStartOfCurrentWeek()),
          formatDateData(getEndOfCurrentWeek())
        ).then(() =>
          updateUser({ first_day: formatDateData(getStartOfCurrentWeek()) })
        )
      }}
    >
      <Native.TouchableOpacity onPress={() => shift(ShiftDirection.BACK)} style={styles.arrowTouchable}>
        <Entypo name="chevron-left" color={textColor} size={30} />
      </Native.TouchableOpacity>
      <Native.Text style={[styles.weekDateText, { color: textColor }]}>
        {formatDate(startDate, true)} - {formatDate(endDate, true)}
      </Native.Text>
      <Native.TouchableOpacity onPress={() => shift(ShiftDirection.FORWARD)} style={styles.arrowTouchable}>
        <Entypo name="chevron-right" color={textColor} size={30} />
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
    borderRadius: 10
  },
  weekDateText: {
    fontSize: 20,
    fontFamily: 'Lexend'
  },
  arrowTouchable: {
    paddingHorizontal: 4
  }
})
