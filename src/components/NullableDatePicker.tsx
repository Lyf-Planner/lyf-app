import { createElement } from 'react';
import { Platform, StyleSheet, Text, TouchableHighlight, View } from 'react-native';

import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import Entypo from 'react-native-vector-icons/Entypo';
import { DateString } from 'schema/util/dates';
import { blackWithOpacity } from 'utils/colours';
import { formatDateData } from 'utils/dates';

type Props = {
  updateDate: (date: DateString | null) => void;
  date?: DateString
  disabled?: boolean
}

export const NullableDatePicker = ({ updateDate, date }: Props) => {
  return (
    <View>
      {date ? (
        <View style={styles.leftShiftDatePicker}>
          <DatePicker date={date} updateDate={updateDate} />
        </View>
      ) : (
        <TouchableHighlight
          style={styles.addDateContainer}
          underlayColor={'rgba(0,0,0,0.5)'}
          onPress={() => {
            updateDate(formatDateData(new Date()));
          }}
        >
          <Text style={styles.addDateText}>Add Date +</Text>
        </TouchableHighlight>
      )}
    </View>
  );
};

export const DatePicker = ({ date, updateDate }: Props) => {
  const updateDateFromPicker = (time: DateTimePickerEvent) => {
    if (Platform.OS === 'web') {
      // the web html component will have this `target` property
      // react native doesn't type that for generalisation purposes
      //
      // @ts-expect-error false type error
      updateDate(time.nativeEvent.target.value);
      return;
    }

    const dateTime = new Date(time.nativeEvent.timestamp)
    const parsedDate = formatDateData(dateTime);
    updateDate(parsedDate);
  };

  const today = new Date();
  const datePickerValue = date ? new Date(date) : today;

  const dateElement = Platform.OS === 'web' ? (
    createElement('input', {
      type: 'date',
      value: date,
      onInput: updateDateFromPicker
    })
  ) : (
    <DateTimePicker
      value={datePickerValue}
      mode={'date'}
      display='calendar'
      onChange={updateDateFromPicker}
    />
  );

  return (
    <View style={styles.mainContainer}>
      <TouchableHighlight
        onPress={() => updateDate(null)}
        underlayColor={'rgba(0,0,0,0.5)'}
        style={styles.pressable}
      >
        <Entypo name="cross" color="rgba(0,0,0,0.2)" size={20} />
      </TouchableHighlight>
      {dateElement}
    </View>
  );
};

const styles = StyleSheet.create({
  addDateContainer: {
    backgroundColor: blackWithOpacity(0.1),
    borderRadius: 8,
    left: 10,
    padding: 8.75,
    position: 'relative'
  },
  addDateText: {
    fontSize: 16
  },
  leftShiftDatePicker: { left: 10, position: 'relative' },
  mainContainer: {
    alignItems: 'center',
    flexDirection: 'row',

    justifyContent: 'flex-start'
  },
  pressable: { borderRadius: 5 }
});
