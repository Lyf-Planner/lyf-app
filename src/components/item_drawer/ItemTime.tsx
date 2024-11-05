import { View, Text, StyleSheet } from 'react-native';

import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

import {
  NullTimeTextOptions,
  NullableTimePicker
} from '@/components/NullableTimePicker';
import { LocalItem } from '@/schema/items';
import { TimeString } from '@/schema/util/dates';
import { localisedFormattedMoment, localisedMoment } from '@/utils/dates';
import { ItemDrawerProps } from '@/utils/item';

export const ItemTime = ({ item, updateItem }: ItemDrawerProps) => {
  const uploadTime = (time: TimeString | undefined) => {
    if (item.invite_pending) {
      return;
    }

    const changeSet: Partial<LocalItem> = { time: time || undefined };

    if (!time && item.notification_mins) {
      changeSet.notification_mins = undefined
    }

    changeSet.end_time = getAdjustedEndTime(time);

    updateItem(item, changeSet);
  };

  const getAdjustedEndTime = (newTime: TimeString | undefined) => {
    if (!newTime || !item.time || !item.end_time) {
      return undefined;
    }

    // Determine the original time window
    const startDateTime = localisedFormattedMoment(item.time, 'HH:mm').toDate()
    const endDateTime = localisedFormattedMoment(item.end_time, 'HH:mm').toDate()

    const window = endDateTime.getTime() - startDateTime.getTime();

    // Add that window to the provided time to get the adjusted end time!
    const newStartDateTime = localisedFormattedMoment(newTime, 'HH:mm')
    const newEndTime = localisedMoment(newStartDateTime)
      .add(window, 'ms')
      .format('HH:mm');

    return newEndTime;
  };

  const getDefaultEndTime = () => {
    const dateTime = localisedFormattedMoment(item.time, 'HH:mm').toDate();

    return localisedMoment(dateTime).add(1, 'hour').format('HH:mm');
  };

  return (
    <View style={styles.mainContainer}>
      <MaterialIcons name="access-time" size={20} />
      <Text style={styles.eventText}>Time</Text>
      <View style={styles.pickerContainer}>
        <NullableTimePicker
          time={item.time}
          updateTime={uploadTime}
          disabled={item.invite_pending}
        />
        <Text style={styles.dashSeperatorText}>-</Text>
        <NullableTimePicker
          time={item.end_time}
          updateTime={async (end_time: TimeString | undefined) =>
            updateItem(item, { end_time })
          }
          disabled={item.invite_pending}
          nullText={NullTimeTextOptions.EndTime}
          defaultTime={getDefaultEndTime()}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  dashSeperatorText: { marginLeft: 20, textAlign: 'center' },
  eventText: { fontFamily: 'Lexend', fontSize: 20 },
  mainContainer: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 8,
    height: 35,
    paddingRight: 10
  },
  pickerContainer: {
    alignItems: 'center',
    flexDirection: 'row',
    marginLeft: 'auto'
  }
});
