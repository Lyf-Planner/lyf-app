import { View, Text, StyleSheet } from 'react-native';
import { NullableDatePicker } from '../../fields/NullableDatePicker';
import { DaysOfWeek, primaryGreen } from '../../../utils/constants';
import { ListItemType, isTemplate } from '../constants';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {
  LyfMenu,
  MenuPopoverPlacement,
  PopoverMenuOption
} from '../../menus/LyfMenu';
import { useCallback, useMemo } from 'react';

export const ItemDate = ({ item, updateItem, invited }) => {
  const routineDay: DaysOfWeek | null = isTemplate(item) ? item.day : null;
  const menuName = useMemo(
    () => `show-in-upcoming-${item.id}-${item.show_in_upcoming}`,
    []
  );

  const updateDate = (date) => {
    if (invited) {
      return;
    }
    updateItem({ ...item, date });
  };

  const getOptionText = useCallback(() => {
    const start = item.show_in_upcoming ? 'Remove from' : 'Add to';
    const end =
      item.type === ListItemType.Event ? '"Upcoming Events"' : '"To Do List"';

    return `${start} ${end}`;
  }, [item.type, item.show_in_upcoming]);

  const menuOptions: PopoverMenuOption[] = [
    {
      text: getOptionText(),
      onSelect: () =>
        updateItem({ ...item, show_in_upcoming: !item.show_in_upcoming })
    }
  ];

  return (
    <View style={styles.mainContainer}>
      <LyfMenu
        name={menuName}
        placement={MenuPopoverPlacement.Top}
        options={menuOptions}
      >
        <View style={styles.fieldNameContainer}>
          <MaterialIcons name="date-range" size={20} />

          <Text style={styles.eventText}>Date</Text>
        </View>
      </LyfMenu>
      <View style={styles.pickerContainer}>
        {routineDay ? (
          <View style={styles.routineContainer}>
            <Text style={styles.routineText}>{`Every ${routineDay}`}</Text>
          </View>
        ) : (
          <NullableDatePicker
            date={item.date}
            updateDate={updateDate}
            disabled={invited}
          />
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
    paddingRight: 10,
    height: 35
  },
  fieldNameContainer: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center'
  },
  routineText: {
    fontSize: 16,
    color: 'white'
  },
  routineContainer: {
    backgroundColor: primaryGreen,
    padding: 8,
    position: 'relative',
    flexDirection: 'row',
    alignItems: 'center',
    left: 10,
    borderRadius: 8
  },
  eventText: { fontSize: 20, fontWeight: '500', fontFamily: 'InterSemi' },
  pickerContainer: { marginLeft: 'auto' }
});
