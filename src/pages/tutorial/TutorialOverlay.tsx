import { View, Text, Image, StyleSheet } from 'react-native';
import { deepBlueOpacity, primaryGreen } from '../../utils/constants';
import { useTutorial } from '../../providers/useTutorial';
import { SaveTooltip } from '../../components/general/Icons';
import AppIntroSlider from 'react-native-app-intro-slider';

const SLIDE_1_IMAGE = require('../../../assets/images/tutorial/slide1.png');
const SLIDE_2_IMAGE = require('../../../assets/images/tutorial/slide2.png');
const SLIDE_3_IMAGE = require('../../../assets/images/tutorial/slide3.png');
const SLIDE_4_IMAGE = require('../../../assets/images/tutorial/slide4.png');
const SLIDE_5_IMAGE = require('../../../assets/images/tutorial/slide5.png');
const SLIDE_6_IMAGE = require('../../../assets/images/tutorial/slide6.png');

export const IntroSlider = () => {
  const { updateTutorial } = useTutorial();

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <AppIntroSlider
        data={slides}
        renderItem={IntroSlideItem}
        showSkipButton
        renderSkipButton={() => <NavigationButton text="Skip" />}
        renderNextButton={() => <NavigationButton text="Next" />}
        renderDoneButton={() => <NavigationButton text="Done" />}
        onSkip={() => updateTutorial(false)}
        onDone={() => updateTutorial(false)}
      />
    </View>
  );
};

export const IntroSlideItem = ({ item }) => {
  return (
    <View style={styles.main}>
      <View style={styles.titleWrapper}>
        <SaveTooltip size={24} />
        <Text style={styles.title}>{item.title}</Text>
      </View>
      <View style={styles.textWrapper}>
        <Text style={styles.topText}>{item.topText}</Text>
      </View>
      {!item.noImage && (
        <View style={styles.imageWrapper}>
          <Image
            source={item.image}
            alt="example"
            style={styles.image}
            resizeMode="contain"
          />
        </View>
      )}
      <View style={styles.textWrapper}>
        <Text style={styles.bottomText}>{item.bottomText}</Text>
      </View>
      {item.thirdText && (
        <View style={styles.textWrapper}>
          <Text style={styles.bottomText}>{item.thirdText}</Text>
        </View>
      )}
    </View>
  );
};

const NavigationButton = ({ text }) => {
  return (
    <View style={styles.navButtonMain}>
      <Text style={styles.navButtonText}>{text}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  main: {
    height: '100%',
    paddingHorizontal: 30,
    paddingVertical: 80,
    flexDirection: 'column',
    gap: 12,
    alignItems: 'center'
  },
  title: {
    color: primaryGreen,
    fontFamily: 'InterSemi',
    fontSize: 30
  },
  topText: {
    color: 'white',
    fontFamily: 'InterMed',
    fontSize: 18
  },
  bottomText: {
    color: 'white',
    fontFamily: 'InterMed',
    fontSize: 18
  },
  textWrapper: {
    backgroundColor: deepBlueOpacity(0.9),
    padding: 8,
    borderRadius: 10
  },
  titleWrapper: {
    backgroundColor: 'white',
    alignItems: 'center',
    gap: 8,
    flexDirection: 'row',
    width: 'auto',
    padding: 8,
    borderRadius: 10
  },
  navButtonMain: {
    backgroundColor: 'white',
    padding: 12,
    borderRadius: 10,
    borderColor: 'white',
    borderWidth: 1
  },
  navButtonText: {
    fontSize: 22,
    color: primaryGreen,
    fontWeight: '600'
  },
  image: {
    borderColor: 'black',
    borderRadius: 50,
    width: '100%',
    height: undefined,
    aspectRatio: 0.9
  },
  imageWrapper: {
    shadowColor: 'black',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 10,
    borderRadius: 10
  }
});

const slides = [
  {
    key: 1,
    title: 'Welcome to Lyf!',
    image: SLIDE_1_IMAGE,
    topText:
      'Lyf is the only tool you need to plan and organise everything',
    bottomText:
      'The all-in-one notebook for every event or task on your radar',
    thirdText: 'Say goodbye to Notes and Calendars!'
  },
  {
    key: 2,
    title: 'Getting Started',
    image: SLIDE_2_IMAGE,
    topText:
      'To create an event or task, type it into the relevant day and press done',
    bottomText: "If you can't find a day for it, that's fine!",
    thirdText:
      'Put it in Upcoming Events or To Do List - you can add a date later'
  },
  {
    key: 3,
    title: 'Routines',
    image: SLIDE_3_IMAGE,
    topText: 'Entering things you do every week can get tedious…',
    bottomText: "Lyf optimises this with it's Routine!",
    thirdText:
      'Items in your Routine are be copied into your timetable every week'
  },
  {
    key: 4,
    title: 'Adding Details',
    image: SLIDE_4_IMAGE,
    topText: 'To add information or details to an item, simply swipe it left',
    bottomText:
      'Here you can set dates, times, reminders, status and descriptions',
    thirdText: 'Of course, you can also invite friends!'
  },
  {
    key: 5,
    title: 'Completing Tasks',
    image: SLIDE_5_IMAGE,
    topText:
      'When you finish an item, simply tap on it, and it will be marked as Done :)',
    bottomText:
      'If you want to get more granular with your planning and mark an item as “In Progress”, simply swipe it right'
  },
  {
    key: 6,
    title: 'Completing Days',
    image: SLIDE_6_IMAGE,
    topText:
      'Once the day is completed, you can hold it down to move on to the next',
    bottomText:
      "To move back a day, hold down the section containing the week's date range!"
  },
  {
    key: 7,
    title: 'All Done!',
    noImage: true,
    topText:
      'To access this Tutorial again, just press the question mark at the top of the page',
    bottomText: 'Enjoy!'
  }
];
