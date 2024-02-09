import { View, Text, Image, StyleSheet } from "react-native";
import { Background } from "../../components/Background";
import { deepBlue, deepBlueOpacity, primaryGreen } from "../../utils/constants";
import AppIntroSlider from "react-native-app-intro-slider";
import { useTutorial } from "../../hooks/useTutorial";
import { SaveTooltip } from "../../components/Icons";
import AntDesign from "react-native-vector-icons/AntDesign";

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
      {item.image}
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
  },
  title: {
    color: primaryGreen,
    fontFamily: "InterSemi",
    fontSize: 30,
  },
  topText: {
    color: "white",
    fontFamily: "InterMed",
    marginTop: 4,
    fontSize: 18,
  },
  bottomText: {
    color: "white",
    fontFamily: "InterMed",
    fontSize: 18,
  },
  textWrapper: {
    backgroundColor: deepBlueOpacity(0.7),
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
});

const slides = [
  {
    key: 1,
    title: "Welcome to Lyf!",
    topText:
      "Lyf is all about planning and organising everything on your plate.",
    bottomText:
      "It is your notebook for tasks, events and todo lists - keeping everything on your radar in one place!",
  },
  {
    key: 2,
    title: "Getting Started",
    topText:
      "To create an event or task, simply type it's title into the desired day",
    bottomText:
      "If you can't find a day for it, that's fine! Just put it in your 'Upcoming Events' or 'Todo List' - you can always add a date to it later",
  },
  {
    key: 3,
    title: "Routines",
    topText: "Entering things you do every week can get tedious…",
    bottomText:
      "You want to start off by putting these items in your Routine! These will be copied into your schedule each week :)",
  },
  {
    key: 4,
    title: "Planning Details",
    topText: "To add information an event or task, simply swipe it right",
    bottomText:
      "Here you can set things like times, reminders, links, locations, even other users!",
  },
  {
    key: 5,
    title: "Completing Tasks",
    topText:
      "When you finish an item, simply tap on it, and it's status will change to Done :)",
    bottomText:
      "If you want to get more granular with your planning and mark an item as “In Progress”, simply swipe it left",
  },
  {
    key: 6,
    title: "Completing Days",
    topText: "When you're done with a day's tasks, how can you clear it?",
    bottomText:
      "After everything is done, you can hold down the day header to move to the next day. If you want it back, no worries, just hold down the week dates!",
  },
  {
    key: 7,
    title: "All Done!",
    topText: "Your now ready to start using Lyf :)",
    bottomText:
      "To access this Tutorial again, just press the question mark at the top of the page. Enjoy!",
  },
];
