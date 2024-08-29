import { Platform, StyleSheet, Text, TouchableHighlight, View } from 'react-native';
import { dateWithTime, localisedMoment } from '../../utils/dates';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import Entypo from 'react-native-vector-icons/Entypo';
import { TimeString } from 'schema/util/dates';
import { SyntheticEvent, createElement } from 'react';
import { white } from 'utils/colours';

export enum NullTimeTextOptions {
  AddTime = 'Add Time +',
  EndTime = '+ End Time',
}

type Props = {
  updateTime: (time: TimeString | undefined) => void;
  time?: TimeString,
  disabled?: boolean,
  nullText?: string,
  defaultTime?: TimeString,
  closeable?: boolean
}

export const NullableTimePicker = ({
  updateTime,
  time,
  disabled = false,
  nullText = NullTimeTextOptions.AddTime,
  defaultTime = '09:00'
}: Props) => {
  return (
    <View>
      {time ? (
        <View style={styles.leftShiftTimePicker}>
          <TimePicker time={time} updateTime={updateTime} disabled={disabled} />
        </View>
      ) : (
        <TouchableHighlight
          style={styles.addTimeContainer}
          underlayColor={'rgba(0,0,0,0.5)'}
          onPress={() => {
            updateTime(defaultTime);
          }}
        >
          <Text
            style={[
              styles.addTimeText,
              { opacity: nullText === NullTimeTextOptions.EndTime ? 0.5 : 1 }
            ]}
          >
            {nullText}
          </Text>
        </TouchableHighlight>
      )}
    </View>
  );
};

export const TimePicker = ({ time, updateTime, disabled = false, closeable = false }: Props) => {
  const updateTimeFromPicker = (time: DateTimePickerEvent) => {
    if (Platform.OS === 'web') {
      // @ts-ignore the web component has a different structure - trust me bro
      updateTime(time.nativeEvent.target.value);
      return;
    }

    const dateTime = new Date(time.nativeEvent.timestamp)
    const parsedTime = localisedMoment(dateTime).format('HH:mm');
    updateTime(parsedTime);
  };

  const today = new Date();
  const datePickerValue =
    time ? 
    dateWithTime(time) : 
    new Date(
      `${today.getFullYear()}-${today.getMonth()}-${today.getDate()} ${time}`
    );

  const timeElement = Platform.OS === 'web' ? (
    createElement('input', {
      type: 'time',
      value: time,
      onInput: updateTimeFromPicker,
    })
  ) : (
    <DateTimePicker
      value={datePickerValue}
      minuteInterval={5}
      mode={'time'}
      is24Hour={true}
      disabled={disabled}
      onChange={updateTimeFromPicker}
    />  
  );

  return (
    <View style={styles.mainContainer}>
      {closeable && (
        <TouchableHighlight
          onPress={() => updateTime(undefined)}
          underlayColor={'rgba(0,0,0,0.5)'}
          style={styles.pressable}
        >
          <Entypo name="cross" color="rgba(0,0,0,0.2)" size={20} />
        </TouchableHighlight>
      )}
      {timeElement}
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
  addTimeContainer: {
    backgroundColor: 'rgba(0,0,0,0.08)',
    padding: 8.75,
    position: 'relative',
    left: 10,
    borderRadius: 8
  },
  addTimeText: {
    fontSize: 16
  },
  leftShiftTimePicker: { position: 'relative', left: 10 }
});
