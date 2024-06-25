import * as Native from 'react-native';
import { CalendarRange } from './containers/CalendarRange';
import { deepBlue } from 'utils/colours';
import Entypo from 'react-native-vector-icons/Entypo';
import { DayDisplay } from './containers/DayDisplay';
import { WeekDays } from 'schema/util/dates';
import { LocalItem } from 'schema/items';
import { useMemo } from 'react';
import { useTimetable } from 'providers/useTimetable';


type Props = {
  items: LocalItem[]
}

export const Routine = () => {
  const { items } = useTimetable();
  const routineItems = useMemo(() => (
    items
    .filter((item) => item.day && !item.date)
    .map((item) => ({ ...item, localised: false }))
  ), [items]);

  return (
    <Native.View>
      <CalendarRange>
          <Native.Text style={styles.weekDateText}>Every Week</Native.Text>
            <Native.Pressable
              onPress={() => {
                Native.Alert.alert(
                  'Routine',
                  'Everything in your routine will be copied into your timetable each week :)'
                );
              }}
            >
              <Entypo name="info-with-circle" color={'black'} size={18} />
            </Native.Pressable>
        </CalendarRange>

        <Native.View style={styles.weekDaysWrapperView}>
          {WeekDays.map((x) => (
            <DayDisplay
              key={x}
              day={x}
              date={null}
              items={items.filter((y) => (y.day && x === y.day))}
            />
          ))}
        </Native.View>
    </Native.View>
  )
}

const styles = Native.StyleSheet.create({
  weekDateText: {
    fontWeight: '600',
    color: deepBlue,
    fontSize: 18,
    fontFamily: 'InterSemi'
  },

  weekDaysWrapperView: {
    flexDirection: 'column',
    paddingHorizontal: 12,
    gap: 14,
    marginTop: 16,

    shadowColor: 'black',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 3
  }
})