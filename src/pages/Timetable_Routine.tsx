import { useCallback } from 'react';
import { View, Text, Pressable, Alert, StyleSheet } from 'react-native';

import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import Entypo from 'react-native-vector-icons/Entypo';

import { PageLoader } from '@/components/PageLoader';
import { DayDisplay } from '@/containers/DayDisplay';
import { PageBackground } from '@/containers/PageBackground';
import { DayOfWeek, WeekDays } from '@/schema/util/dates';
import { useTimetableStore } from '@/store/useTimetableStore';
import { black, primaryGreen, white } from '@/utils/colours';

export const Routine = () => {
  const { loading, items } = useTimetableStore();

  const routineItems = useCallback(
    (day: DayOfWeek) => Object.values(items).filter((item) => item.day && day === item.day),
    [items]);

  return (
    <PageBackground sunRight locations={[0,0.82,1]} noPadding>
      <KeyboardAwareScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={styles.scrollContainer}>
          <View style={styles.header}>
            <Text style={styles.weekDateText}>Every Week</Text>
            <Pressable
              onPress={() => {
                Alert.alert(
                  'Your Routine',
                  'Everything here will be copied into your timetable each week :)'
                );
              }}
            >
              <Entypo name="info-with-circle" color={white} size={18} />
            </Pressable>
          </View>

          {!loading &&
            <View style={styles.weekDaysWrapperView}>
              {WeekDays.map((day) => (
                <DayDisplay
                  key={day}
                  day={day}
                  date={null}
                  items={routineItems(day)}
                  shadowOffset={{ width: -3, height: 3 }}
                />
              ))}
            </View>
          }

          {loading && <PageLoader />}

        </View>
      </KeyboardAwareScrollView>
    </PageBackground>
  )
}

const styles = StyleSheet.create({
  header: {
    alignItems: 'center',
    backgroundColor: primaryGreen,
    borderRadius: 10,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 8,
    justifyContent: 'center',
    padding: 12,

    shadowColor: black,
    shadowOffset: { width: -2, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 3
  },

  scroll: {
    overflow: 'visible',
    paddingBottom: 100
  },

  scrollContainer: {
    alignSelf: 'center',
    flexDirection: 'column',
    marginBottom: 200,
    maxWidth: 450,
    padding: 20,
    width: '100%'
  },

  weekDateText: {
    color: white,
    fontFamily: 'Lexend',
    fontSize: 20
  },
  weekDaysWrapperView: {
    flexDirection: 'column',
    gap: 14,
    marginTop: 16
  }
})
