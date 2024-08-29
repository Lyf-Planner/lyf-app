import { Platform, StyleSheet, Text, TouchableHighlight, View } from 'react-native';
import { formatDateData } from '../../utils/dates';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import Entypo from 'react-native-vector-icons/Entypo';
import { DateString } from 'schema/util/dates';
import { createElement } from 'react';

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
      // @ts-ignore the web component has a different structure - trust me bro
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
      onInput: updateDateFromPicker,
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
  mainContainer: {
    flexDirection: 'row',
    alignItems: 'center',

    justifyContent: 'flex-start'
  },
  pressable: { borderRadius: 5 },
  addDateContainer: {
    backgroundColor: 'rgba(0,0,0,0.08)',
    padding: 8.75,
    position: 'relative',
    left: 10,
    borderRadius: 8
  },
  addDateText: {
    fontSize: 16
  },
  leftShiftDatePicker: { position: 'relative', left: 10 }
});
