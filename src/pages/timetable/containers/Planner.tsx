import { useEffect, useMemo, useState } from 'react';
import { View, Text, StyleSheet, Alert, Pressable } from 'react-native';
import { dayFromDateString, extendByWeek, formatDate, formatDateData, localisedMoment, parseDateString, upcomingWeek } from '../../../utils/dates';
import { deepBlue, primaryGreen } from '../../../utils/colours';
import { BouncyPressable } from '../../../components/pressables/BouncyPressable';
import { useAuth } from '../../../authorisation/AuthProvider';
import Entypo from 'react-native-vector-icons/Entypo';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { LocalItem } from 'schema/items';
import { DayDisplay } from './DayDisplay';
import { WeekDays } from 'schema/util/dates';

type Props = {
  items: LocalItem[]
}

export const Planner = ({ items }: Props) => {
  const { user, updateUser } = useAuth();
  const firstDay = useMemo(() => user?.first_day || formatDateData(new Date()), [])

  const [updatingTemplate, setUpdatingTemplate] = useState(false);
  const [displayedDays, setDisplayedDays] = useState(upcomingWeek(firstDay));

  useEffect(() => {
    // TODO: Function to adjust displayedDays in response to first_day changes
  }, [user?.first_day]);

  const unshiftFirst = async () => {
    const first = user?.first_day || formatDateData(new Date());
    const prev = formatDateData(
      localisedMoment(parseDateString(first)).add(-1, 'day').toDate()
    );

    if (prev.localeCompare(firstDay) >= 0) {
      updateUser({
        ...user,
        first_day: prev
      });
    }
  };

  const addWeek = () => setDisplayedDays(extendByWeek(displayedDays));
  const updateDisplayedDays = (start: string, end: string) => null; // TODO: Return something

  return (
    <View>
      <View style={styles.menuButtonRow}>
       <MenuButton
          selected={!updatingTemplate}
          onPress={() => setUpdatingTemplate(false)}
        >
          <MaterialCommunityIcons name="table" size={24} color="white" />
          <Text style={[styles.menuButtonText]}>Timetable</Text>
        </MenuButton>
        <MenuButton
          selected={updatingTemplate}
          onPress={() => setUpdatingTemplate(true)}
        >
          <MaterialCommunityIcons
            name="refresh"
            size={24}
            color="white"
            style={{ top: 1 }}
          />
          <Text style={styles.menuButtonText}>Routine</Text>
        </MenuButton>
      </View>

      {/* TODO: Date selector (like this) */}
      {updatingTemplate ? (
        <CalendarRange onLongPress={() => unshiftFirst()}>
          <Text style={styles.weekDateText}>Every Week</Text>
            <Pressable
              onPress={() => {
                Alert.alert(
                  'Routine',
                  'Everything in your routine will be copied into your timetable each week :)'
                );
              }}
            >
              <Entypo name="info-with-circle" color={'black'} size={18} />
            </Pressable>
        </CalendarRange>
      ) :(
        <CalendarRange>
          <Text style={styles.weekDateText}>
            {formatDate(firstDay)} - {formatDate(displayedDays[displayedDays.length - 1])}
          </Text>
        </CalendarRange>
      )}      

      {updatingTemplate ? (
        <View>
          {WeekDays.map((x) => (
            <DayDisplay
              key={x}
              day={x}
              items={items.filter((y) => (y.day && x === y.day))}
            />
          ))}
        </View>
      ) : (
        <View>
          {displayedDays.map((x) => (
            <DayDisplay
              key={x[0]}
              date={x}
              items={items.filter((y) => (y.date && x.includes(y.date)) || y.day)}
            />
          ))}
        </View>
      )}

      {!updatingTemplate && (
        <View style={styles.addWeekButton}>
          <BouncyPressable
            onPress={() => addWeek()}
            style={styles.addWeekTouchable}
            useTouchableHighlight
          >
            <View style={styles.addWeekView}>
              <Entypo name="chevron-down" size={20} />
              <Text style={{ fontSize: 18 }}>Next Week</Text>
              <Entypo name="chevron-down" size={20} />
            </View>
          </BouncyPressable>
        </View>
      )}
    </View>
  );
};

type CalendarProps = {
  onLongPress?: () => void;
  children: JSX.Element | JSX.Element[]
}

const CalendarRange = ({ onLongPress, children }: CalendarProps) => {
  return (
    <BouncyPressable
      style={styles.weekDateDisplayTouchable}
      onLongPress={onLongPress}
    >
      <View style={styles.weekDateDisplayContainer}>
        <View style={styles.weekDatePressable}>
          {children}
        </View>
      </View>
    </BouncyPressable>
  );
}

type MenuProps = {
  children: JSX.Element | JSX.Element[];
  onPress: () => void;
  selected?: boolean;
}

const MenuButton = ({ children, onPress, selected = false }: MenuProps) => {
  return (
    <BouncyPressable
      style={styles.menuButton}
      onPress={onPress}
      containerStyle={{ flex: 1 }}
      conditionalStyles={{ borderColor: selected ? 'black' : primaryGreen }}
    >
      {children}
    </BouncyPressable>
  );
};

const styles = StyleSheet.create({
  menuButtonRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 10,
    marginTop: 8,
    marginHorizontal: 16,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10
  },
  menuButton: {
    backgroundColor: primaryGreen,
    flex: 1,
    padding: 12,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    borderRadius: 10,
    borderWidth: 2,
    shadowColor: 'black',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2
  },
  infoPressable: {
    marginLeft: 2,
    flexDirection: 'row',
    alignItems: 'center'
  },
  menuButtonText: {
    color: 'white',
    fontSize: 20,
    padding: 2,
    fontFamily: 'InterMed'
  },
  addWeekView: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    gap: 5,
    padding: 15,
    width: 250,
    borderRadius: 10
  },
  addWeekTouchable: {
    borderRadius: 10
  },
  addWeekButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 10,
    marginBottom: 10
  }, 

  weekDateDisplayContainer: {
    flexDirection: 'row',
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 10,

    alignItems: 'center',
    justifyContent: 'center'
  },
  weekDateDisplayTouchable: {
    marginTop: 16,
    marginHorizontal: 12,
    backgroundColor: 'rgba(0,0,0,0.2)',
    borderRadius: 10
  },
  weekDatePressable: {
    borderRadius: 10,
    marginVertical: 6,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8
  },
  weekDateText: {
    fontWeight: '600',
    color: deepBlue,
    fontSize: 18,
    fontFamily: 'InterSemi'
  },
  weekDaysWrapperView: {
    flexDirection: 'column',
    gap: 16,
    marginTop: 16,

    shadowColor: 'black',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 3
  }
});
