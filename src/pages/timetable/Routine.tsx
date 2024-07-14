import * as Native from 'react-native';
import { CalendarRange } from './containers/CalendarRange';
import { deepBlue, primaryGreen, white } from 'utils/colours';
import Entypo from 'react-native-vector-icons/Entypo';
import { DayDisplay } from './containers/DayDisplay';
import { WeekDays } from 'schema/util/dates';
import { LocalItem } from 'schema/items';
import { useMemo } from 'react';
import { useTimetable } from 'providers/cloud/useTimetable';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { Loader, PageLoader } from 'components/general/MiscComponents';


type Props = {
  items: LocalItem[]
}

export const Routine = () => {
  const { loading, items } = useTimetable();
  const routineItems = useMemo(() => (
    items
    .filter((item) => item.day && !item.date)
    .map((item) => ({ ...item, localised: false }))
  ), [items]);

  return (
    <KeyboardAwareScrollView>
      <Native.View style={styles.main}>
        <Native.View style={styles.header}>
            <Native.Text style={styles.weekDateText}>Every Week</Native.Text>
              <Native.Pressable
                onPress={() => {
                  Native.Alert.alert(
                    'Your Routine',
                    'Everything here will be copied into your timetable each week :)'
                  );
                }}
              >
                <Entypo name="info-with-circle" color={white} size={18} />
              </Native.Pressable>
          </Native.View>

          {!loading &&
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
          }

          {loading && <PageLoader />}
        </Native.View>
    </KeyboardAwareScrollView>
  )
}

const styles = Native.StyleSheet.create({
  main: {
    marginBottom: 125,
    marginTop: 15,
    paddingHorizontal: 14,
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    padding: 12,
    borderWidth: 1,
    borderRadius: 10,
    backgroundColor: primaryGreen,

    shadowOffset: { width: 2, height: 2 },
    shadowColor: 'black',
    shadowOpacity: 1,
    shadowRadius: 3
  },

  weekDateText: {
    color: 'white',
    fontSize: 20,
    fontFamily: 'Lexend',
  },

  weekDaysWrapperView: {
    flexDirection: 'column',
    gap: 14,
    marginTop: 16,

    shadowColor: 'black',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 3
  },

  loadingContainer: {
    marginTop: 20,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10,
  },
  loadingText: {
    fontFamily: 'Lexend',
    fontSize: 20
  },
})