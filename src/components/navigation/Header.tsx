// Each stack attached to bottom tab pages technically has it's own header
// This is to enable stack based use of the back button
// Hence this file contains functions which return a header dynamic to each stack

import * as Native from 'react-native'
import { Image, Pressable, StyleSheet, TouchableHighlight } from "react-native";
import { useNavigation } from "@react-navigation/native";
import Fontisto from "react-native-vector-icons/Fontisto";
import { gentleBlack, primaryGreen, white } from "utils/colours";
import { BottomTabNavigationOptions } from "@react-navigation/bottom-tabs";

const LyfIcon = require("../../../assets/images/icon.png")
      
      // <Image
      //   source={TREE}
      //   alt="tree"
      //   style={styles.smallTree}
      //   resizeMode="contain"
      // />
      // <Image
      //   source={ROUND_TREE}
      //   alt="round-tree"
      //   style={styles.roundTree}
      //   resizeMode="contain"
      //   resizeMethod={'resize'}
      // />

export function defaultTabHeader(label: string): BottomTabNavigationOptions  {
  return {
    headerShown: true,
    headerStyle: headerStyles.header,
    headerTitle: () => (
      <Native.View style={headerStyles.titleContent}>
        <Native.Text style={headerStyles.title}>{label}</Native.Text>
      </Native.View>
    ),
    headerLeft: () => (
      <Native.TouchableOpacity style={headerStyles.tutorialContent} onPress={() => null}>
        <Image source={LyfIcon} style={headerStyles.icon} resizeMode="contain"/>
      </Native.TouchableOpacity>
    ),
    headerRight: () => (
      <Native.TouchableOpacity style={headerStyles.settingsContent} onPress={() => null}>
        <Fontisto name="spinner-cog" style={headerStyles.cog} size={25} />
      </Native.TouchableOpacity>
    ),
    headerTitleStyle: headerStyles.title,
    tabBarHideOnKeyboard: true,
  };
}

const headerStyles = StyleSheet.create({
  header: {
    borderBottomWidth: 0.5,
    borderBottomColor: gentleBlack,
    backgroundColor: white,
    height: 100
  },
  titleContent: {
    flexDirection: "row",
    justifyContent: "flex-start",
    gap: 10,
    paddingBottom: 4,
    alignItems: "center",
  },
  tutorialContent: {
    flexDirection: "row",
    justifyContent: "flex-start",
    gap: 10,
    marginLeft: 20,
    paddingBottom: 4,
    alignItems: "center",
  },
  settingsContent: {
    flexDirection: "row",
    justifyContent: "flex-start",
    gap: 10,
    marginRight: 20,
    paddingBottom: 4,
    alignItems: "center",
  },
  title: {
    color: primaryGreen,
    fontFamily: "Lexend-Semibold",
    fontSize: 28,
    textAlign: "center",
  },
  back: {
    marginLeft: 20,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    padding: 1,
  },
  icon: { 
    height: 40,
    width: 30,
    position: 'relative',
    bottom: 2
  },
  cog: {
    position: 'relative',
    bottom: 2
  }
});
