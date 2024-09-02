import { View, Text, Image, StyleSheet, ListRenderItemInfo, Platform } from 'react-native';
import { deepBlueOpacity, eventsBadgeColor, primaryGreen, white } from '../../utils/colours';
import { useTutorial } from 'providers/overlays/useTutorial';
import { SaveTooltip } from '../../components/general/Icons';
import AppIntroSlider from 'react-native-app-intro-slider';
import { Background } from 'components/general/Background';
import { PageBackground } from 'components/general/PageBackground';
import { ScrollView } from 'react-native-gesture-handler';
import { BouncyPressable } from 'components/pressables/BouncyPressable';
import { TipsDropdown } from 'components/dropdowns/TipsDropdown';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Entypo from 'react-native-vector-icons/Entypo';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation } from '@react-navigation/native';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { RouteParams } from 'Routes';

export const TutorialOverlay = () => {
  const { updateTutorial, updateTutorialRoute } = useTutorial();

  return (
    <PageBackground locations={[0, 0.9, 1]} noPadding bottomAdjustment={false}>
      <ScrollView style={styles.scroll}>
        <View style={styles.main}>
          <View style={styles.titleWrapper}>
            <SaveTooltip size={24} />
            <Text style={styles.title}>Welcome To Lyf</Text>
          </View>

          <BouncyPressable 
            onPress={() => null}
            style={styles.doneButton}
            withShadow
          >
            <Text style={styles.doneText}>Instructions are provided below. Access these anytime by pressing the leaf icon!</Text>
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
              "You'll also notice a Routine section - any event or task here will recur each week.",
              "If you want to plan something but can't find a date for it, chuck it in your Upcoming Events or To Do List :)"
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
              'You can also add a "?" to any title, and it will mark it as Tentative.',
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
        </View>
      </ScrollView>
    </PageBackground>
  );
};

const styles = StyleSheet.create({
  main: {
    height: '100%',
    flex: 1,
    paddingTop: 100,
    paddingHorizontal: 20,
    flexDirection: 'column',
    gap: 12,
  },
  scroll: { 
    flex: 1, 
    alignSelf: 'center',
    maxWidth: 500,
    width: '100%',
    height: '100%', 
    overflow: 'visible',
    paddingBottom: Platform.OS === 'web' ? 100 : 0,
    marginBottom: Platform.OS === 'web' ? 0 : 100,
  },
  title: {
    color: primaryGreen,
    fontFamily: 'Lexend',
    fontSize: 24
  },
  topText: {
    color: primaryGreen,
    fontFamily: 'Lexend',
    fontSize: 18
  },
  textWrapper: {
    backgroundColor: white,
    padding: 8,
    borderRadius: 10
  },
  titleWrapper: {
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    flexDirection: 'row',
    width: 'auto',
    padding: 8,
    borderRadius: 10
  },
  doneButton: {
    backgroundColor: primaryGreen,
    borderRadius: 10,
    padding: 10,
    flexDirection: 'row',
    justifyContent: 'center'
  },
  doneText: {
    fontFamily: 'Lexend',
    fontSize: 16,
    color: white
  }
});
