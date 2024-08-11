import * as Native from 'react-native';
import { addWeekToStringDate, allDatesBetween, dayFromDateString, extendByWeek, formatDate, formatDateData, getStartOfCurrentWeek, localisedMoment, parseDateString, upcomingWeek } from 'utils/dates';
import { useEffect, useMemo, useState } from 'react';
import { useAuth } from 'providers/cloud/useAuth';
import { CalendarRange } from './containers/CalendarRange';
import { blackWithOpacity, deepBlue, eventsBadgeColor, sun, white } from 'utils/colours';
import { DayDisplay } from './containers/DayDisplay';
import { LocalItem } from 'schema/items';
import { BouncyPressable } from 'components/pressables/BouncyPressable';
import Entypo from 'react-native-vector-icons/Entypo';
import { ListDropdown } from 'components/dropdowns/ListDropdown';
import { ItemType } from 'schema/database/items';
import { v4 as uuid } from 'uuid';
import { inProgressColor, isTemplate } from 'components/list/constants';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { useTimetable } from 'providers/cloud/useTimetable';
import { PageLoader } from 'components/general/MiscComponents';
import { PageBackground } from 'components/general/PageBackground';

export const Calendar = () => {
  const { loading, items, reload, startDate, endDate } = useTimetable();
  const { user, updateUser } = useAuth()

  const displayedDays = useMemo(() => allDatesBetween(startDate, endDate), [startDate, endDate]);

  useEffect(() => {
    // TODO: Function to adjust displayedDays in response to first_day changes
  }, [user?.first_day]);

  // const unshiftFirst = async () => {
  //   const first = user?.first_day || formatDateData(new Date());
  //   const prev = formatDateData(
  //     localisedMoment(parseDateString(first)).add(-1, 'day').toDate()
  //   );

  //   if (prev.localeCompare(firstDay) >= 0) {
  //     updateUser({
  //       ...user,
  //       first_day: prev
  //     });
  //   }
  // };

  const addWeek = () => reload(startDate, addWeekToStringDate(endDate));

  const calendarItems = useMemo(() => {
    const localItems: LocalItem[] = [];

    for (const date of displayedDays) {
      for (const item of items) {
        if (item.date === date) {
          localItems.push({ ...item, localised: false });
        }

        // Template Match Case 1 - Matching Day
        if (isTemplate(item) && item.day === dayFromDateString(date)) {
          // Escape due to instantiation 
          if (items.some((x) => x.template_id === item.id && x.date === date)) {
            continue;
          }

          localItems.push({
            ...item,
            id: uuid(),
            date,
            day: undefined,
            template_id: item.id,
            localised: true,
          })
        }
      }
    }

    return localItems;
  }, [items, displayedDays])

  const upcomingEvents = useMemo(() => (
    items
    .filter(
      (x) =>
        x.type === ItemType.Event &&
        ((!x.date && !x.day) || x.show_in_upcoming)
    )
    .map((item) => ({ ...item, localised: false }))
  ), [items]);

  const toDoList = useMemo(() => (
    items
    .filter(
      (x) =>
        x.type === ItemType.Task &&
        ((!x.date && !x.day) || x.show_in_upcoming)
    )
    .map((item) => ({ ...item, localised: false }))
  ), [items]);

  return (
    <PageBackground locations={[0,0.82,1]}>
      <KeyboardAwareScrollView enableResetScrollToCoords={false} style={styles.scroll}>
        <Native.View style={styles.scrollContainer}>
          <Native.View style={styles.dropdowns}>
            <ListDropdown
              items={upcomingEvents}
              name="Upcoming Events"
              icon={<Entypo name="calendar" color={eventsBadgeColor} size={22} />}
              listType={ItemType.Event}
            />
            <ListDropdown
              items={toDoList}
              name="To Do List"
              icon={<Entypo name="list" color={eventsBadgeColor} size={22} />}
              listType={ItemType.Task}
            />
          </Native.View>

          <CalendarRange />

          {loading && <PageLoader />}

          {!loading &&
            <Native.View style={styles.calendarWrapper}>
              {displayedDays.map((x) => (
                <DayDisplay
                  key={x}
                  date={x}
                  day={null}
                  items={calendarItems.filter((y) => y.date === x)}
                />
              ))}

              <Native.View style={styles.addWeekButton}>
                <BouncyPressable
                  onPress={() => addWeek()}
                  style={styles.addWeekTouchable}
                  useTouchableHighlight
                >
                  <Native.View style={styles.addWeekView}>
                    <Entypo name="chevron-down" size={20} />
                    <Native.Text style={styles.addWeekText}>Add Week</Native.Text>
                    <Entypo name="chevron-down" size={20} />
                  </Native.View>
                </BouncyPressable>
              </Native.View>
            </Native.View>
          }
        </Native.View>
      </KeyboardAwareScrollView>
    </PageBackground>
  )
}

const styles = Native.StyleSheet.create({
  scroll: {
    overflow: 'visible'
  },

  main: {
    minHeight: '100%',
    paddingBottom: 125,
    paddingHorizontal: 14,
    paddingTop: 15,
  },

  scrollContainer: {
    flexDirection: "column",
    gap: 14,
  },

  dropdowns: {
    flexDirection: 'column',
    gap: 4,
  },

  calendarWrapper: {
    flexDirection: 'column',
    gap: 10,
    borderRadius: 10
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

  addWeekView: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 5,
    padding: 15,
    backgroundColor: "white",
    width: 250,
    borderRadius: 10
  },
  addWeekTouchable: {
    borderRadius: 10
  },
  addWeekButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 15,
  },
  addWeekText: { 
    fontSize: 18,
    fontFamily: "Lexend"
  }
})