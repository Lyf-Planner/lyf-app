import { createElement, useEffect, useMemo, useState } from 'react';
import { Platform, StyleSheet, Text, TouchableHighlight, View } from 'react-native';

import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import Entypo from 'react-native-vector-icons/Entypo';

import { TimeString } from '@/schema/util/dates';
import { blackWithOpacity } from '@/utils/colours';
import { dateWithTime, localisedMoment } from '@/utils/dates';

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
  const conditionalStyles = {
    addTimeText: { opacity: nullText === NullTimeTextOptions.EndTime ? 0.5 : 1 }
  }

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
              conditionalStyles.addTimeText
            ]}
          >
            {nullText}
          </Text>
        </TouchableHighlight>
      )}
    </View>
  );
};

export const TimePicker = ({ time, updateTime, disabled = false, closeable = true }: Props) => {
  const [localisedTime, setLocalisedTime] = useState(time);

  useEffect(() => {
    updateTime(localisedTime);
  }, [localisedTime])

  const updateTimeFromPicker = (time: DateTimePickerEvent) => {
    if (Platform.OS === 'web') {
      // the web html component will have this `target` property
      // react native doesn't type that for generalisation purposes
      //
      // @ts-expect-error false type error
      setLocalisedTime(time.nativeEvent.target.value);
      return;
    }

    const dateTime = new Date(time.nativeEvent.timestamp)
    const parsedTime = localisedMoment(dateTime).format('HH:mm');
    setLocalisedTime(parsedTime);
  };

  const today = new Date();
  const datePickerValue = useMemo(() => {
    return localisedTime ?
      dateWithTime(localisedTime) :
      new Date(
        `${today.getFullYear()}-${today.getMonth()}-${today.getDate()} ${localisedTime}`
      );
  }, [localisedTime])

  const timeElement = Platform.OS === 'web' ? (
    createElement('input', {
      type: 'time',
      value: time,
      onInput: updateTimeFromPicker
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
  addTimeContainer: {
    backgroundColor: blackWithOpacity(0.08),
    borderRadius: 8,
    left: 10,
    padding: 8.75,
    position: 'relative'
  },
  addTimeText: {
    fontSize: 16
  },
  leftShiftTimePicker: { left: 10, position: 'relative' },
  mainContainer: {
    alignItems: 'center',
    flexDirection: 'row',

    justifyContent: 'flex-start'
  },
  pressable: { borderRadius: 5 }
});
