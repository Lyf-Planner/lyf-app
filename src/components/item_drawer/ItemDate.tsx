import { useCallback, useMemo } from 'react';
import { View, Text, StyleSheet } from 'react-native';

import { NullableDatePicker } from 'components/NullableDatePicker';
import {
  LyfMenu,
  MenuPopoverPlacement,
  PopoverMenuOption
} from 'containers/LyfMenu';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { ItemType } from 'schema/database/items';
import { primaryGreen } from 'utils/colours';
import { isTemplate } from 'utils/item';
import { ItemDrawerProps } from 'utils/item';

export const ItemDate = ({ item, updateItem }: ItemDrawerProps) => {
  const routineDay: string | undefined = isTemplate(item) ? item.day : undefined;
  const menuName = useMemo(
    () => `show-in-upcoming-${item.id}-${item.show_in_upcoming}`, []
  );

  const getOptionText = useCallback(() => {
    const start = item.show_in_upcoming ? 'Remove from' : 'Add to';
    const end = item.type === ItemType.Event ? '"Upcoming Events"' : '"To Do List"';

    return `${start} ${end}`;
  }, [item.type, item.show_in_upcoming]);

  const menuOptions: PopoverMenuOption[] = [
    {
      text: getOptionText(),
      onSelect: () =>
        updateItem(item, { show_in_upcoming: !item.show_in_upcoming })
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
            updateDate={(date: string | null) => updateItem(item, { date: date || undefined })}
            disabled={item.invite_pending}
          />
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  eventText: { fontFamily: 'Lexend', fontSize: 20 },
  fieldNameContainer: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 8
  },
  mainContainer: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 8,
    height: 35,
    paddingRight: 10
  },
  pickerContainer: {
    marginLeft: 'auto'
  },
  routineContainer: {
    alignItems: 'center',
    backgroundColor: primaryGreen,
    borderRadius: 8,
    flexDirection: 'row',
    left: 10,
    padding: 8,
    position: 'relative'
  },
  routineText: {
    color: white,
    fontFamily: 'Lexend',
    fontSize: 16
  }
});
