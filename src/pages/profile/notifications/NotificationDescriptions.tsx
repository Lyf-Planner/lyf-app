import {
  View,
  Text,
  TouchableHighlight,
  TextInput,
  StyleSheet
} from 'react-native';
import { localisedMoment } from 'utils/dates';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { TimeString } from 'schema/util/dates';

type Props = {
  updateTime: (time?: TimeString) => void,
  notificationTime: TimeString,
  updatePersistent: (enabled?: boolean) => void,
  persistent?: boolean
}

export const DailyNotificationDesc = ({
  updateTime,
  notificationTime = '08:00',
  updatePersistent,
  persistent = false
}: Props) => {
  const today = new Date();
  // Component needs a JS date, even though we only use time (just take any date)
  const datePickerValue = new Date(
    `${today.getFullYear()}-${today.getMonth()}-${today.getDate()} ${notificationTime}`
  );

  const updateTimeFromPicker = (time: DateTimePickerEvent) => {
    // Picker gives us a timestamp, that we need to convert to 24 hr time
    const dateTime = new Date(time.nativeEvent.timestamp);
    updateTime(localisedMoment(dateTime).format('HH:mm'));
  };

  return (
    <View style={dailyStyles.mainContainer}>
      <Text style={dailyStyles.firstText}>Receive reminders each day at </Text>
      <View style={dailyStyles.dateTimeWrapper}>
        <DateTimePicker
          value={datePickerValue}
          minuteInterval={5}
          mode={'time'}
          is24Hour={true}
          onChange={updateTimeFromPicker}
          style={dailyStyles.dateTimeDimensions}
        />
      </View>

      <Text style={dailyStyles.secondText}>
        about your schedule for today.{' '}
      </Text>
      <TouchableHighlight
        onPress={() => updatePersistent(!persistent)}
        style={dailyStyles.persistentTouchable}
        underlayColor={'rgba(0,0,0,0.5)'}
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
  const updateMinutesFromInput = (text: string) => {
    text.replace(/[^0-9]/g, '');
    const val = Number(text);
    val < 1000 && updateMins(val);
  };

  const replaceEmptyWithZero = () => !minsBefore && updateMins(0);

  return (
    <View style={eventStyles.mainContainer}>
      <Text style={eventStyles.firstText}>Receive reminders </Text>
      <TextInput
        value={minsBefore.toString()}
        onEndEditing={replaceEmptyWithZero}
        returnKeyType="done"
        keyboardType="numeric"
        onChangeText={updateMinutesFromInput}
        style={eventStyles.minutesInput}
      />
      <Text style={eventStyles.secondText}> minutes before</Text>
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
  firstText: { fontSize: 16, fontWeight: '300' },
  dateTimeWrapper: { borderRadius: 10, overflow: 'hidden' },
  dateTimeDimensions: {
    width: 85,
    height: 30
  },
  secondText: { fontSize: 16, fontWeight: '300' },
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
  thirdText: { fontSize: 16, lineHeight: 28, fontWeight: '300' }
});

const eventStyles = StyleSheet.create({
  mainContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center'
  },
  firstText: { fontSize: 16, lineHeight: 30, fontWeight: '300' },
  minutesInput: {
    backgroundColor: 'rgba(0,0,0,0.08)',
    paddingVertical: 4,
    paddingHorizontal: 6,
    width: 40,
    borderRadius: 8,
    fontSize: 15,
    textAlign: 'center'
  },
  secondText: { fontSize: 16, lineHeight: 30, fontWeight: '300' }
});
