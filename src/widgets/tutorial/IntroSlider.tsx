import { View, Text, Image, StyleSheet } from "react-native";
import { deepBlueOpacity, primaryGreen } from "../../utils/constants";
import { useTutorial } from "../../hooks/useTutorial";
import { SaveTooltip } from "../../components/Icons";
import AppIntroSlider from "react-native-app-intro-slider";

const SLIDE_1_IMAGE = require(`../../../assets/images/tutorial/slide1.png`);
const SLIDE_2_IMAGE = require(`../../../assets/images/tutorial/slide2.png`);
const SLIDE_3_IMAGE = require(`../../../assets/images/tutorial/slide3.png`);
const SLIDE_4_IMAGE = require(`../../../assets/images/tutorial/slide4.png`);
const SLIDE_5_IMAGE = require(`../../../assets/images/tutorial/slide5.png`);
const SLIDE_6_IMAGE = require(`../../../assets/images/tutorial/slide6.png`);

export const IntroSlider = () => {
  const { updateTutorial } = useTutorial();

  return (
    <AppIntroSlider
      data={slides}
      renderItem={IntroSlideItem}
      showSkipButton
      onSkip={() => updateTutorial(false)}
      onDone={() => updateTutorial(false)}
    />
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
    </View>
  );
};

const styles = StyleSheet.create({
  main: {
    height: "100%",
    paddingHorizontal: 30,
    paddingVertical: 80,
    flexDirection: "column",
    gap: 12,
    alignItems: "center",
  },
  title: {
    color: primaryGreen,
    fontFamily: "InterSemi",
    fontSize: 30,
  },
  topText: {
    color: "white",
    fontFamily: "InterMed",
    fontSize: 18,
  },
  bottomText: {
    color: "white",
    fontFamily: "InterMed",
    fontSize: 18,
  },
  textWrapper: {
    backgroundColor: deepBlueOpacity(0.9),
    padding: 8,
    borderRadius: 10,
  },
  titleWrapper: {
    backgroundColor: "white",
    alignItems: "center",
    gap: 8,
    flexDirection: "row",
    width: "auto",
    padding: 8,
    borderRadius: 10,
  },
  image: {
    borderColor: "black",
    borderRadius: 50,
    width: "100%",
    height: undefined,
    aspectRatio: 0.85,
  },
  imageWrapper: {
    shadowColor: "black",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 10,
    borderRadius: 10,
  },
});

const slides = [
  {
    key: 1,
    title: "Welcome to Lyf!",
    image: SLIDE_1_IMAGE,
    topText:
      "Lyf is the only tool you need to plan and organise everything on your plate",
    bottomText:
      "It is your notebook for tasks, events and todo lists - to keep everything on your radar in one place!",
  },
  {
    key: 2,
    title: "Getting Started",
    image: SLIDE_2_IMAGE,
    topText:
      "To create an event or task, simply type it's title into the desired day",
    bottomText:
      "If you can't find a day for it, that's fine! Just put it in Upcoming Events or To Do List - you can always add a date to it later",
  },
  {
    key: 3,
    title: "Routines",
    image: SLIDE_3_IMAGE,
    topText: "Entering things you do every week can get tedious…",
    bottomText:
      "You want to start off by putting these items in your Routine! These will be copied into your timetable each week",
  },
  {
    key: 4,
    title: "Planning Details",
    image: SLIDE_4_IMAGE,
    topText: "To add information to an event or task, simply swipe it right",
    bottomText:
      "Here you can set things like times, reminders, links, locations, even add other users!",
  },
  {
    key: 5,
    title: "Completing Tasks",
    image: SLIDE_5_IMAGE,
    topText:
      "When you finish an item, simply tap on it, and it's status will change to Done :)",
    bottomText:
      "If you want to get more granular with your planning and mark an item as “In Progress”, simply swipe it left",
  },
  {
    key: 6,
    title: "Completing Days",
    image: SLIDE_6_IMAGE,
    topText:
      "After everything is done, you can hold down the top of the day to move to the next",
    bottomText:
      "If you want the day back, just hold down the week dates at the top of the week!",
  },
  {
    key: 7,
    title: "All Done!",
    noImage: true,
    topText: "You're now ready to start using Lyf :)",
    bottomText:
      "To access this Tutorial again, just press the question mark at the top of the page. Enjoy!",
  },
];
