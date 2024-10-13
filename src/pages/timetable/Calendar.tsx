import * as Native from 'react-native';
import { addWeekToStringDate, allDatesBetween, dateWithTime, dayFromDateString, daysDifferenceBetween, extendByWeek, formatDate, formatDateData, getStartOfCurrentWeek, localisedMoment, parseDateString, upcomingWeek } from 'utils/dates';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useAuth } from 'providers/cloud/useAuth';
import { CalendarRange } from './containers/CalendarRange';
import { black, blackWithOpacity, deepBlue, deepBlueOpacity, eventsBadgeColor, primaryGreen, secondaryGreen, sun, white } from 'utils/colours';
import { DayDisplay } from './containers/DayDisplay';
import { LocalItem } from 'schema/items';
import { BouncyPressable } from 'components/pressables/BouncyPressable';
import Entypo from 'react-native-vector-icons/Entypo';
import { ListDropdown } from 'components/dropdowns/ListDropdown';
import { ItemType } from 'schema/database/items';
import { v4 as uuid } from 'uuid';
import { inProgressColor, isTemplate } from 'components/item/constants';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { useTimetable } from 'providers/cloud/useTimetable';
import { PageLoader } from 'components/general/MiscComponents';
import { PageBackground } from 'components/general/PageBackground';
import { WeekDays } from 'schema/util/dates';
import { ScrollView } from 'react-native-gesture-handler';

export const Calendar = () => {
  const { loading, items, reload, startDate, endDate } = useTimetable();
  const scrollRef = useRef<ScrollView>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({ x: 0, y: 0 });
    }
  }, [startDate, endDate]);

  const displayedDays = useMemo(() => allDatesBetween(startDate, endDate), [startDate, endDate]);

  const calendarItems = useMemo(() => {
    const localItems: LocalItem[] = [];

    for (const date of displayedDays) {
      for (const item of items) {
        if (item.date === date) {
          localItems.push({ ...item, localised: false });
        }

        // Template Match Case 1 - Matching Day
        if (isTemplate(item) && item.day === dayFromDateString(date)) {
          const templateInstanceExists = items.some((x) => x.template_id === item.id && x.date === date);
          const isPriorDate = date.localeCompare(formatDateData(new Date())) < 0;

          if (templateInstanceExists || isPriorDate) {
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

    return localItems.sort((a, b) => {
      if (a.time && b.time) {
        return dateWithTime(a.time).getTime() - dateWithTime(b.time).getTime();
      }

      return a.sorting_rank - b.sorting_rank
    });
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

  const addWeek = () => {
    const newStart = formatDateData(localisedMoment(startDate).add(WeekDays.length, 'days').toDate())
    const newEnd = formatDateData(localisedMoment(endDate).add(WeekDays.length, 'days').toDate())

    reload(newStart, newEnd);
  }

  // Different layout for web - dropdowns are adjascent to calendar and forced open
  if (Native.Platform.OS === 'web') {
    return (
      <PageBackground locations={[0,0.82,1]}>
        <ScrollView style={styles.scroll} ref={scrollRef}>
          <Native.View style={styles.webContainer}>
            <Native.View style={styles.webDropdowns}>
              <ListDropdown
                items={upcomingEvents}
                name="Upcoming Events"
                icon={<Entypo name="calendar" color={eventsBadgeColor} size={22} />}
                listType={ItemType.Event}
                startOpen={Native.Platform.OS === 'web'}
              />
            </Native.View>

            <Native.View style={styles.webCalendar}>
              <CalendarRange color={deepBlueOpacity(0.9)} textColor={eventsBadgeColor} />

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
                        <Native.Text style={styles.addWeekText}>Next Week</Native.Text>
                        <Entypo name="chevron-down" size={20} />
                      </Native.View>
                    </BouncyPressable>
                  </Native.View>
                </Native.View>
              }
            </Native.View>

            <Native.View style={styles.webDropdowns}>
              <ListDropdown
                items={toDoList}
                name="To Do List"
                icon={<Entypo name="list" color={eventsBadgeColor} size={22} />}
                listType={ItemType.Task}
                startOpen={Native.Platform.OS === 'web'}
              />
            </Native.View>
          </Native.View>
        </ScrollView>
      </PageBackground>
    )
  }

  return (
    <PageBackground locations={[0,0.82,1]} noPadding>
      <KeyboardAwareScrollView 
        enableResetScrollToCoords={false} 
        style={styles.scroll} 
        extraScrollHeight={50}
      >
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

          <CalendarRange color={deepBlueOpacity(0.2)} textColor={black} />

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
                    <Native.Text style={styles.addWeekText}>Next Week</Native.Text>
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
    overflow: 'visible',
    width: '100%',
    flex: 1,
    paddingBottom: 150,
  },

  webContainer: {
    flexDirection: 'row',
    gap: 20,
    paddingVertical: 20,
    alignSelf: 'center'
  },

  scrollContainer: {
    alignSelf: 'center',
    flexDirection: "column",
    gap: 14,
    padding: 20,
    maxWidth: 450,
    width: '100%',
    marginBottom: 250,
  },

  webCalendar: {
    flexDirection: "column",
    gap: 14,
    width: 450,
    flex: 1
  },

  webDropdowns: {
    flexDirection: "column",
    gap: 14,
    width: 400,
    flex: 1
  },

  dropdowns: {
    flexDirection: 'column',
    gap: 6,
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