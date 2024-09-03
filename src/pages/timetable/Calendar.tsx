import * as Native from 'react-native';
import { addWeekToStringDate, allDatesBetween, dayFromDateString, daysDifferenceBetween, extendByWeek, formatDate, formatDateData, getStartOfCurrentWeek, localisedMoment, parseDateString, upcomingWeek } from 'utils/dates';
import { useEffect, useMemo, useState } from 'react';
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

  const addWeek = () => {
    const newStart = formatDateData(localisedMoment(startDate).add(WeekDays.length, 'days').toDate())
    const newEnd = formatDateData(localisedMoment(endDate).add(WeekDays.length, 'days').toDate())

    reload(newStart, newEnd);
  }

  // Different layout for web - dropdowns are adjascent to calendar and forced open
  if (Native.Platform.OS === 'web') {
    return (
      <PageBackground locations={[0,0.82,1]}>
        <ScrollView style={styles.scroll}>
          <Native.View style={styles.webContainer}>
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
          </Native.View>
        </ScrollView>
      </PageBackground>
    )
  }

  return (
    <PageBackground locations={[0,0.82,1]}>
      <KeyboardAwareScrollView 
        enableResetScrollToCoords={false} 
        style={styles.scroll} 
        showsVerticalScrollIndicator={false}
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

          <CalendarRange color={primaryGreen} />

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
    flex: 1,
    paddingTop: 18,
    paddingBottom: 150,
  },

  main: {
    minHeight: '100%',
    paddingHorizontal: 14,
    paddingTop: 15,
  },

  webContainer: {
    flexDirection: 'row',
    gap: 20,
    alignSelf: 'center'
  },

  scrollContainer: {
    alignSelf: 'center',
    flexDirection: "column",
    gap: 14,
    maxWidth: 450,
    width: '100%',
    paddingBottom: 150,
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