import { useEffect, useState } from "react";
import { View, Text, Pressable, StyleSheet, Alert } from "react-native";
import { WeekDisplay } from "./WeekDisplay";
import {
  extendByWeek,
  formatDateData,
  getStartOfCurrentWeek,
  initialiseDays,
} from "../../utils/dates";
import Entypo from "react-native-vector-icons/Entypo";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import FontAwesome6Icon from "react-native-vector-icons/FontAwesome6";
import { primaryGreen } from "../../utils/constants";
import { BouncyPressable } from "../../components/BouncyPressable";
import { Routine } from "./Routine";
import { useAuth } from "../../authorisation/AuthProvider";

export const Planner = ({ items }) => {
  const { user } = useAuth();
  const [updatingTemplate, setUpdatingTemplate] = useState(false);
  const [displayedWeeks, setDisplayedWeeks] = useState(initialiseDays(user));

  useEffect(() => {
    // Keep remote first_day in sync with any!
    setDisplayedWeeks(initialiseDays(user));
  }, [user.timetable.first_day]);

  const addWeek = () => setDisplayedWeeks(extendByWeek([...displayedWeeks]));

  return (
    <View>
      <View style={styles.menuButtonRow}>
        <MenuButton
          selected={!updatingTemplate}
          onPress={() => setUpdatingTemplate(false)}
        >
          <MaterialCommunityIcons name="table" size={24} color="white" />
          <Text style={styles.menuButtonText}>Timetable</Text>
        </MenuButton>
        <MenuButton
          selected={updatingTemplate}
          onPress={() => setUpdatingTemplate(true)}
        >
          <MaterialCommunityIcons name="refresh" size={24} color="white" />
          <Text style={styles.menuButtonText}>Routine</Text>
        </MenuButton>
      </View>

      {updatingTemplate ? (
        <Routine items={items.filter((x) => x.day && !x.date)} />
      ) : (
        <View>
          {displayedWeeks.map((x, i) => (
            <WeekDisplay
              key={x[0]}
              isFirst={i === 0}
              dates={x}
              items={items.filter((y) => x.includes(y.date) || y.day)}
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

const MenuButton = ({ children, onPress, selected = false }) => {
  return (
    <BouncyPressable
      style={styles.menuButton}
      onPress={onPress}
      containerStyle={{ flex: 1 }}
      conditionalStyles={{ borderColor: selected ? "black" : primaryGreen }}
    >
      {children}
    </BouncyPressable>
  );
};

const styles = StyleSheet.create({
  menuButtonRow: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 10,
    marginTop: 8,
    marginHorizontal: 16,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  menuButton: {
    backgroundColor: primaryGreen,
    flex: 1,
    padding: 8,
    height: "75%",
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
    borderRadius: 10,
    borderWidth: 2,
    shadowColor: "black",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
  },
  infoPressable: {
    marginLeft: 2,
    flexDirection: "row",
    alignItems: "center",
  },
  menuButtonText: {
    color: "white",
    fontSize: 22,
    padding: 6,
    fontFamily: "InterMed",
  },
  addWeekView: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    gap: 5,
    padding: 15,
    width: 250,
    borderRadius: 10,
  },
  addWeekTouchable: {
    borderRadius: 10,
  },
  addWeekButton: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 10,
    marginBottom: 10,
  },
});
