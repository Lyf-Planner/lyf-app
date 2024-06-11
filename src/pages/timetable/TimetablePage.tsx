import { useCallback, useEffect, useMemo } from 'react';
import { View, StyleSheet } from 'react-native';
import { Planner } from './containers/Planner';
import { ListDropdown } from '../../components/dropdowns/ListDropdown';
import { ListType } from '../../components/list/List';
import { ListItemType } from '../../components/list/constants';
import { useTimetable } from '../../providers/useTimetable';
import Entypo from 'react-native-vector-icons/Entypo';
import { ItemType } from 'schema/database/items';

export const Timetable = () => {
  const { items, loading, reload } = useTimetable();

  useEffect(() => {
    if (loading) {
      reload();
    }
  }, [])

  const upcomingEvents = useMemo(() => (
    items.filter(
      (x) =>
        x.type === ItemType.Event &&
        ((!x.date && !x.day) || x.show_in_upcoming)
    )
  ), [items]);

  const toDoList = useMemo(() => (
    items.filter(
      (x) =>
        x.type === ItemType.Task &&
        ((!x.date && !x.day) || x.show_in_upcoming)
    )
  ), [items]);

  const scheduledItems = useMemo(() => (
    items.filter((x) => x.date || x.day)
  ), [items]);

  return (
    <View style={styles.widgetContainer}>
      <View style={styles.miscListContainer}>
        <ListDropdown
          items={upcomingEvents}
          name="Upcoming Events"
          icon={<Entypo name="calendar" size={22} />}
          listType={ListType.Event}
        />
        <ListDropdown
          items={toDoList}
          name="To Do List"
          icon={<Entypo name="list" size={22} />}
          listType={ListType.Task}
        />
      </View>
      <Planner items={scheduledItems} />
    </View>
  );
};

const styles = StyleSheet.create({
  widgetContainer: {
    flexDirection: 'column',
    marginTop: 10,
    flex: 1,
    gap: 2
  },
  miscListContainer: {
    flexDirection: 'column',
    gap: 6,
    marginHorizontal: 14,
    marginTop: 2,
    marginBottom: 6,
    borderRadius: 10
  }
});
