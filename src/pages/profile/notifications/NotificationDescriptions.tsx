import {
  View,
  Text,
  TouchableHighlight,
  TextInput,
  StyleSheet
} from 'react-native';
import { dateWithTime, localisedMoment } from 'utils/dates';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { TimeString } from 'schema/util/dates';
import { useEffect, useRef, useState } from 'react';
import debouncer from 'signature-debouncer';
import { TimePicker } from 'components/fields/NullableTimePicker';

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



  console.log('date picker value', datePickerValue)

  return (
    <View style={dailyStyles.mainContainer}>
      <Text style={dailyStyles.firstText}>Receive reminders each day at </Text>
      <View style={dailyStyles.dateTimeWrapper}>
        <TimePicker updateTime={updateTime} time={notificationTime} />
      </View>

      <Text style={dailyStyles.secondText}>
        about your schedule for the day.{' '}
      </Text>
      <TouchableHighlight
        onPress={() => updatePersistent(!persistent)}
        style={dailyStyles.persistentTouchable}
        underlayColor={'rgba(255,255,255,0.5)'}
      >
        <Text style={dailyStyles.persistentText}>
          {persistent ? 'Will' : "Won't"}
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
  const debounceSignature = "EventNotificationMins"

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
  mainContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    gap: 2
  },
  firstText: {
    opacity: 0.6,
    fontSize: 16,
    color: 'white'
  },
  dateTimeWrapper: { borderRadius: 10, overflow: 'hidden' },
  dateTimeDimensions: {
    width: 85,
    height: 30
  },
  secondText: {
    opacity: 0.6,
    fontSize: 16,
    color: 'white'
  },
  persistentTouchable: {
    backgroundColor: 'rgba(0,0,0,0.08)',
    paddingVertical: 5,
    paddingHorizontal: 6,
    width: 60,
    borderRadius: 8
  },
  persistentText: {
    fontSize: 14,
    textAlign: 'center'
  },
  thirdText: {
    opacity: 0.6,
    fontSize: 16,
    lineHeight: 28,
    color: 'white'
  }
});

const eventStyles = StyleSheet.create({
  mainContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center'
  },
  firstText: {
    opacity: 0.6,
    fontSize: 16,
    color: 'white'
  },
  minutesInput: {
    backgroundColor: 'rgba(255,255,255,0.08)',
    paddingVertical: 4,
    paddingHorizontal: 6,
    width: 40,
    borderRadius: 8,
    fontSize: 15,
    textAlign: 'center'
  },
  secondText: {
    opacity: 0.6,
    fontSize: 16,
    lineHeight: 28,
    color: 'white'
  }
});
