import * as Native from 'react-native';
import { deepBlue, primaryGreen, white } from 'utils/colours';
import Entypo from 'react-native-vector-icons/Entypo';
import { DayDisplay } from './containers/DayDisplay';
import { WeekDays } from 'schema/util/dates';
import { useTimetable } from 'providers/cloud/useTimetable';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { Loader, PageLoader } from 'components/general/MiscComponents';
import { PageBackground } from 'components/general/PageBackground';

export const Routine = () => {
  const { loading, items } = useTimetable();

  return (
    <PageBackground sunRight locations={[0,0.82,1]} noPadding>
      <KeyboardAwareScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
        <Native.View style={styles.scrollContainer}>
          <Native.View style={styles.header}>
            <Native.Text style={styles.weekDateText}>Every Week</Native.Text>
              <Native.Pressable
                onPress={() => {
                  Native.Alert.alert(
                    'Your Routine',
                    'Everything here will be copied into your timetable each week :)'
                  );
                }}
              >
                <Entypo name="info-with-circle" color={white} size={18} />
              </Native.Pressable>
          </Native.View>

          {!loading &&
            <Native.View style={styles.weekDaysWrapperView}>
              {WeekDays.map((x) => (
                <DayDisplay
                  key={x}
                  day={x}
                  date={null}
                  items={items.filter((y) => (y.day && x === y.day))}
                  shadowOffset={{ width: -3, height: 3 }}
                />
              ))}
            </Native.View>
          }

          {loading && <PageLoader />}
          
        </Native.View>
      </KeyboardAwareScrollView>
    </PageBackground>
  )
}

const styles = Native.StyleSheet.create({
  main: {
    marginBottom: 125,
    marginTop: 15,
    paddingHorizontal: 14,
  },

  scroll: {
    overflow: 'visible',
    paddingBottom: 100
  },

  scrollContainer: {
    alignSelf: 'center',
    flexDirection: "column",
    maxWidth: 450,
    width: '100%',
    marginBottom: 200,
    padding: 20,
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    padding: 12,
    borderWidth: 1,
    borderRadius: 10,
    backgroundColor: primaryGreen,

    shadowOffset: { width: -1, height: 1 },
    shadowColor: 'black',
    shadowOpacity: 1,
    shadowRadius: 2
  },

  weekDateText: {
    color: 'white',
    fontSize: 20,
    fontFamily: 'Lexend',
  },

  weekDaysWrapperView: {
    flexDirection: 'column',
    gap: 14,
    marginTop: 16,
  },

  loadingContainer: {
    marginTop: 20,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10,
  },
  loadingText: {
    fontFamily: 'Lexend',
    fontSize: 20
  },
})