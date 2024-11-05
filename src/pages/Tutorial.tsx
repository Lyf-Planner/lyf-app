import { View, Text, StyleSheet, Platform } from 'react-native';

import { ScrollView } from 'react-native-gesture-handler';
import Entypo from 'react-native-vector-icons/Entypo';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

import { LyfIcon } from '@/assets/icons/LyfIcon';
import { BouncyPressable } from '@/components/BouncyPressable';
import { PageBackground } from '@/containers/PageBackground';
import { TipsDropdown } from '@/containers/TipsDropdown';
import env from '@/envManager';
import { useTutorial } from '@/hooks/overlays/useTutorial';
import { black, eventsBadgeColor, primaryGreen, white } from '@/utils/colours';

export const TutorialOverlay = () => {
  const { updateTutorial, updateTutorialRoute } = useTutorial();

  return (
    <PageBackground locations={[0, 0.9, 1]} noPadding>
      <ScrollView style={styles.scroll}>
        <View style={styles.main}>
          <View style={styles.titleWrapper}>
            <LyfIcon size={24} />
            <Text style={styles.title}>Welcome To Lyf</Text>
          </View>

          <BouncyPressable
            onPress={() => null}
            style={styles.doneButton}
            withShadow
          >
            <Text style={styles.doneText}>Access these guides anytime by pressing the Lyf icon in the top left</Text>
          </BouncyPressable>
          <TipsDropdown
            icon={<MaterialCommunityIcons name='calendar' size={26} color={eventsBadgeColor}/>}
            navigate={() => {
              updateTutorialRoute('Timetable')
              updateTutorial(false);
            }}
            name="Timetable Basics"
            tips={[
              'The Lyf timetable is a blend of a calendar and to-do list, with a primary focus on the week at hand.',
              'Events are items you need to attend to in your day, most likely at a set time.',
              'Tasks are things you can do any time in the day! No need to micromanage.',
              'You\'ll also notice a Routine section - any event or task here will recur each week.',
              'If you want to plan something but can\'t find a date for it, chuck it in your Upcoming Events or To Do List :)'
            ]}
          />
          <TipsDropdown
            icon={<MaterialIcons name='add-task' size={25} color={eventsBadgeColor} />}
            navigate={() => {
              updateTutorialRoute('Timetable')
              updateTutorial(false);
            }}
            name="Timetable Usage"
            tips={[
              'To add something to your timetable, enter it in the relevant day.',
              'You can also add Events or Tasks from the Creation Menu (big + button).',
              'To mark an item as Done, just press it. Hold down only if you want to delete it.',
              'To add more details or invite friends, swipe it left!',
              'To mark it as "In Progress", swipe it right.',
              'You can also add a "?" to any title, and it will mark it as Tentative.'
            ]}
          />
          <TipsDropdown
            icon={<Entypo name='list' size={25} color={eventsBadgeColor} />}
            navigate={() => {
              updateTutorialRoute('Notes');
              updateTutorial(false);
            }}
            name="Using Notes"
            tips={[
              'Notes are useful for jotting down ideas and keeping lists of things.',
              'In the Notes page, you can create a Note or a List.',
              'A List is similar to the list of tasks/events you see in your Calendar, but can be for anything!',
              'A note is just a blank piece of text for whatever your heart desires.',
              'These can also be created from the Creation Page.'
            ]}
          />
          <TipsDropdown
            icon={<FontAwesome5 name="user-friends" size={22} color={eventsBadgeColor} />}
            navigate={() => {
              updateTutorialRoute('Friends')
              updateTutorial(false);
            }}
            name="Adding Friends"
            tips={[
              'Navigate to the Friends page to add your friends on Lyf.',
              'Ask your friends for their usernames and search for them - your username is found at the top of your Profile page.',
              'Once Friends, you can invite other users to your Events and Tasks.',
              'Pressing on a user will show their profile, and show you their friends which you can add too!'
            ]}
          />
          <TipsDropdown
            icon={<FontAwesome5 name="user-alt" size={22} color={eventsBadgeColor} />}
            navigate={() => {
              updateTutorialRoute('Profile')
              updateTutorial(false);
            }}
            name="Your Profile"
            tips={[
              'In your Profile you can configure various preferences:',
              'Display Name - how your name is presented to other users',
              'Privacy Settings - use the app completely hidden from all other users',
              'Daily Reminders - get reminded each day at a specific time about your schedule',
              'Event Reminders - automatic reminders some amount of minutes before every Event.',
              'Weather Data - location based weather data to be included in your Calendar',
              'Danger Zone - account and data deletion options'
            ]}
          />

          <BouncyPressable
            onPress={() => updateTutorial(false)}
            style={styles.doneButton}
            withShadow
          >
            <Text style={styles.doneText}>Get Started!</Text>
          </BouncyPressable>

          <Text style={styles.version}>v{env.VERSION}</Text>
        </View>
      </ScrollView>
    </PageBackground>
  );
};

const styles = StyleSheet.create({
  doneButton: {
    backgroundColor: primaryGreen,
    borderRadius: 10,
    flexDirection: 'row',
    justifyContent: 'center',
    padding: 10
  },
  doneText: {
    color: white,
    fontFamily: 'Lexend',
    fontSize: 16
  },
  main: {
    flex: 1,
    flexDirection: 'column',
    gap: 12,
    height: '100%',
    paddingHorizontal: 20,
    paddingTop: 100
  },
  scroll: {
    alignSelf: 'center',
    flex: 1,
    height: '100%',
    marginBottom: Platform.OS === 'web' ? 0 : 100,
    maxWidth: 500,
    overflow: 'visible',
    paddingBottom: Platform.OS === 'web' ? 100 : 0,
    width: '100%'
  },
  title: {
    color: primaryGreen,
    fontFamily: 'Lexend',
    fontSize: 24
  },
  titleWrapper: {
    alignItems: 'center',
    backgroundColor: white,
    borderRadius: 10,
    flexDirection: 'row',
    gap: 8,
    justifyContent: 'center',
    padding: 8,
    width: 'auto'
  },
  version: {
    alignSelf: 'center',
    color: black,
    fontFamily: 'Lexend',
    fontSize: 16,
    marginTop: 10,
    opacity: 0.3
  }
});
