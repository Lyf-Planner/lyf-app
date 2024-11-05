import { useEffect, useMemo, useRef } from 'react';
import { Text, View, Platform, StyleSheet } from 'react-native';

import { ScrollView } from 'react-native-gesture-handler';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import Entypo from 'react-native-vector-icons/Entypo';
import { v4 as uuid } from 'uuid';

import { BouncyPressable } from '@/components/BouncyPressable';
import { CalendarRange } from '@/components/CalendarRange';
import { PageLoader } from '@/components/PageLoader';
import { DayDisplay } from '@/containers/DayDisplay';
import { ListDropdown } from '@/containers/ListDropdown';
import { PageBackground } from '@/containers/PageBackground';
import { useTimetable } from '@/hooks/cloud/useTimetable';
import { ItemType } from '@/schema/database/items';
import { LocalItem } from '@/schema/items';
import { WeekDays } from '@/schema/util/dates';
import { black, deepBlueOpacity, eventsBadgeColor, white } from '@/utils/colours';
import { allDatesBetween, dayFromDateString, formatDateData, localisedMoment } from '@/utils/dates';
import { isTemplate } from '@/utils/item';

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
            localised: true
          })
        }
      }
    }

    return localItems.sort((a, b) => a.sorting_rank - b.sorting_rank);
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
  if (Platform.OS === 'web') {
    return (
      <PageBackground locations={[0,0.82,1]}>
        <ScrollView style={styles.scroll} ref={scrollRef}>
          <View style={styles.webContainer}>
            <View style={styles.webDropdowns}>
              <ListDropdown
                items={upcomingEvents}
                name="Upcoming Events"
                icon={<Entypo name="calendar" color={eventsBadgeColor} size={22} />}
                listType={ItemType.Event}
                startOpen={Platform.OS === 'web'}
              />
            </View>

            <View style={styles.webCalendar}>
              <CalendarRange color={deepBlueOpacity(0.9)} textColor={eventsBadgeColor} />

              {loading && <PageLoader />}

              {!loading &&
                <View style={styles.calendarWrapper}>
                  {displayedDays.map((x) => (
                    <DayDisplay
                      key={x}
                      date={x}
                      day={null}
                      items={calendarItems.filter((y) => y.date === x)}
                    />
                  ))}

                  <View style={styles.addWeekButton}>
                    <BouncyPressable
                      onPress={() => addWeek()}
                      style={styles.addWeekTouchable}
                      useTouchableHighlight
                    >
                      <View style={styles.addWeekView}>
                        <Entypo name="chevron-down" size={20} />
                        <Text style={styles.addWeekText}>Next Week</Text>
                        <Entypo name="chevron-down" size={20} />
                      </View>
                    </BouncyPressable>
                  </View>
                </View>
              }
            </View>

            <View style={styles.webDropdowns}>
              <ListDropdown
                items={toDoList}
                name="To Do List"
                icon={<Entypo name="list" color={eventsBadgeColor} size={22} />}
                listType={ItemType.Task}
                startOpen={Platform.OS === 'web'}
              />
            </View>
          </View>
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
        <View style={styles.scrollContainer}>
          <View style={styles.dropdowns}>
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
          </View>

          <CalendarRange color={deepBlueOpacity(0.2)} textColor={black} />

          {loading && <PageLoader />}

          {!loading &&
            <View style={styles.calendarWrapper}>
              {displayedDays.map((x) => (
                <DayDisplay
                  key={x}
                  date={x}
                  day={null}
                  items={calendarItems.filter((y) => y.date === x)}
                />
              ))}

              <View style={styles.addWeekButton}>
                <BouncyPressable
                  onPress={() => addWeek()}
                  style={styles.addWeekTouchable}
                  useTouchableHighlight
                >
                  <View style={styles.addWeekView}>
                    <Entypo name="chevron-down" size={20} />
                    <Text style={styles.addWeekText}>Next Week</Text>
                    <Entypo name="chevron-down" size={20} />
                  </View>
                </BouncyPressable>
              </View>
            </View>
          }
        </View>
      </KeyboardAwareScrollView>
    </PageBackground>
  )
}

const styles = StyleSheet.create({
  addWeekButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 15
  },

  addWeekText: {
    fontFamily: 'Lexend',
    fontSize: 18
  },

  addWeekTouchable: {
    borderRadius: 10
  },

  addWeekView: {
    alignItems: 'center',
    backgroundColor: white,
    borderRadius: 10,
    flexDirection: 'row',
    gap: 5,
    justifyContent: 'center',
    padding: 15,
    width: 250
  },

  calendarWrapper: {
    borderRadius: 10,
    flexDirection: 'column',
    gap: 10
  },

  dropdowns: {
    flexDirection: 'column',
    gap: 6
  },

  scroll: {
    flex: 1,
    overflow: 'visible',
    paddingBottom: 150,
    width: '100%'
  },

  scrollContainer: {
    alignSelf: 'center',
    flexDirection: 'column',
    gap: 14,
    marginBottom: 250,
    maxWidth: 450,
    padding: 20,
    width: '100%'
  },
  webCalendar: {
    flexDirection: 'column',
    flex: 1,
    gap: 14,
    width: 450
  },
  webContainer: {
    alignSelf: 'center',
    flexDirection: 'row',
    gap: 20,
    paddingVertical: 20
  },
  webDropdowns: {
    flexDirection: 'column',
    flex: 1,
    gap: 14,
    width: 400
  }
})
