import { TouchableOpacity, Text, StyleSheet } from 'react-native';

import Entypo from 'react-native-vector-icons/Entypo';

import { BouncyPressable } from '@/components/BouncyPressable';
import { useAuth } from '@/hooks/cloud/useAuth';
import { useTimetable } from '@/hooks/cloud/useTimetable';
import { WeekDays } from '@/schema/util/dates';
import { formatDate, formatDateData, getEndOfCurrentWeek, getStartOfCurrentWeek, localisedMoment } from '@/utils/dates';

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
      <TouchableOpacity onPress={() => shift(ShiftDirection.BACK)} style={styles.arrowTouchable}>
        <Entypo name="chevron-left" color={textColor} size={30} />
      </TouchableOpacity>
      <Text style={[styles.weekDateText, { color: textColor }]}>
        {formatDate(startDate, true)} - {formatDate(endDate, true)}
      </Text>
      <TouchableOpacity onPress={() => shift(ShiftDirection.FORWARD)} style={styles.arrowTouchable}>
        <Entypo name="chevron-right" color={textColor} size={30} />
      </TouchableOpacity>
    </BouncyPressable>
  );
}

const styles = StyleSheet.create({
  arrowTouchable: {
    paddingHorizontal: 4
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
