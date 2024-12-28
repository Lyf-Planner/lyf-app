import { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  TouchableHighlight,
  TextInput,
  StyleSheet,
  Platform
} from 'react-native';

import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import debouncer from 'signature-debouncer';

import { TimePicker } from '@/components/NullableTimePicker';
import { TimeString } from '@/schema/util/dates';
import { white } from '@/utils/colours';
import { dateWithTime, localisedMoment } from '@/utils/dates';

type Props = {
  updateTime: (time?: TimeString) => void,
  notificationTime: TimeString,
  updatePersistent: (enabled?: boolean) => void,
  persistent?: boolean
}

export const DailyNotificationDesc = ({
  updateTime,
  notificationTime = '08:30',
  updatePersistent,
  persistent = false
}: Props) => {
  // Component needs a JS date, even though we only use time (just take any date)
  const datePickerValue = dateWithTime(notificationTime)

  const updateTimeFromPicker = (time: DateTimePickerEvent) => {
    // Picker gives us a timestamp, that we need to convert to 24 hr time
    const dateTime = new Date(time.nativeEvent.timestamp);
    updateTime(localisedMoment(dateTime).format('HH:mm'));
  };

  return (
    <View style={dailyStyles.mainContainer}>
      <Text style={dailyStyles.firstText}>Receive reminders each day at </Text>
      {Platform.OS === 'web' ? (
        <TimePicker updateTime={updateTime} time={notificationTime} closeable={false} />
      ) : (
        <View style={dailyStyles.dateTimeWrapper}>
          <DateTimePicker
            value={datePickerValue}
            minuteInterval={5}
            mode='time'
            is24Hour
            onChange={updateTimeFromPicker}
            style={dailyStyles.dateTimeDimensions}
          />
        </View>
      )}

      <Text style={dailyStyles.secondText}>
        about your schedule for the day.{' '}
      </Text>
      <TouchableHighlight
        onPress={() => updatePersistent(!persistent)}
        style={dailyStyles.persistentTouchable}
        underlayColor={'rgba(255,255,255,0.5)'}
      >
        <Text style={dailyStyles.persistentText}>
          {persistent ? 'Will' : 'Won\'t'}
        </Text>
      </TouchableHighlight>
      <Text style={dailyStyles.thirdText}>
        send a reminder if nothing is planned.
      </Text>
    </View>
  );
};

type EventProps = {
  updateMins: (mins?: number) => void;
  minsBefore: number
}

export const EventNotificationDesc = ({
  updateMins,
  minsBefore
}: EventProps) => {
  const [mins, setMins] = useState(minsBefore.toString())
  const debounceSignature = 'EventNotificationMins'

  const resetToDefaultIfEmpty = () => {
    if (!mins) {
      setMins('5');
      updateMins(5);
    }
  }

  const initialUpdate = useRef(true);
  useEffect(() => {
    if (initialUpdate.current) {
      initialUpdate.current = false;
      return;
    }

    debouncer.run(() => {
      if (mins) {
        const digitsOnly = mins.replace(/[^0-9]/g, '');
        const val = Number(digitsOnly);
        updateMins(val);
      }
    }, debounceSignature, 1000)
  }, [mins])

  return (
    <View style={eventStyles.mainContainer}>
      <Text style={eventStyles.firstText}>Receive reminders </Text>
      <TextInput
        value={mins}
        onEndEditing={resetToDefaultIfEmpty}
        returnKeyType="done"
        keyboardType="numeric"
        onChangeText={setMins}
        style={eventStyles.minutesInput}
      />
      <Text style={eventStyles.secondText}> minutes before all</Text>
      <Text style={eventStyles.secondText}>events as a default</Text>
    </View>
  );
};

const dailyStyles = StyleSheet.create({
  dateTimeDimensions: {
    alignSelf: 'center',
    flex: 1,
    height: 30,
    width: 75
  },
  dateTimeWrapper: {
    backgroundColor: white,
    borderRadius: 10,
    height: 30,
    overflow: 'hidden',
    width: 75
  },
  firstText: {
    color: white,
    fontSize: 16,
    opacity: 0.6
  },
  mainContainer: {
    alignItems: 'center',
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 2
  },
  persistentText: {
    fontSize: 14,
    textAlign: 'center'
  },
  persistentTouchable: {
    backgroundColor: white,
    borderRadius: 8,
    paddingHorizontal: 6,
    paddingVertical: 5,
    width: 60
  },
  secondText: {
    color: white,
    fontSize: 16,
    opacity: 0.6
  },
  thirdText: {
    color: white,
    fontSize: 16,
    lineHeight: 28,
    opacity: 0.6
  }
});

const eventStyles = StyleSheet.create({
  firstText: {
    color: white,
    fontSize: 16,
    opacity: 0.6
  },
  mainContainer: {
    alignItems: 'center',
    flexDirection: 'row',
    flexWrap: 'wrap'
  },
  minutesInput: {
    backgroundColor: white,
    borderRadius: 8,
    fontSize: 15,
    paddingHorizontal: 6,
    paddingVertical: 4,
    textAlign: 'center',
    width: 40
  },
  secondText: {
    color: white,
    fontSize: 16,
    lineHeight: 28,
    opacity: 0.6
  }
});
