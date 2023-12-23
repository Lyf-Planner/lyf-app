import { useState } from "react";
import { View, Text, Pressable, StyleSheet, Alert } from "react-native";
import { WeekDisplay } from "./WeekDisplay";
import { mapDatesToWeek, parseDateString } from "../../utils/dates";
import moment from "moment";
import Entypo from "react-native-vector-icons/Entypo";
import { primaryGreen } from "../../utils/constants";
import { BouncyPressable } from "../../components/BouncyPressable";

export const Planner = ({
  weeks,
  updateWeeks,
  templates,
  updateTemplates,
}: any) => {
  const [updatingTemplate, setUpdatingTemplate] = useState(false);
  const [displayedWeeks, setDisplayedWeeks] = useState(weeks.slice(0, 1));

  const updateWeekAtIndex = (index: any, week: any) => {
    var modifiedWeeks;
    if (index > weeks.length) {
      // Displayed weeks must be longer than weeks
      modifiedWeeks = displayedWeeks.slice(0, index + 1);
    } else {
      modifiedWeeks = weeks;
    }
    modifiedWeeks[index] = week;

    updateWeeks(modifiedWeeks);
  };

  const addWeek = () => {
    // Add all the user's weeks and after that add templates
    if (displayedWeeks.length < weeks.length)
      setDisplayedWeeks(weeks.slice(0, displayedWeeks.length + 1));
    else {
      // Need to include dates as well
      var last = parseDateString(
        displayedWeeks[displayedWeeks.length - 1].Monday.date
      );

      var next = moment(last).add(1, "week");

      var newTemplate = JSON.parse(JSON.stringify(templates[0]));
      var untouchedWeek = mapDatesToWeek(newTemplate, next.toDate());

      setDisplayedWeeks(displayedWeeks.concat(untouchedWeek));
    }
  };

  return (
    <View>
      <View style={styles.menuButtonRow}>
        <MenuButton
          selected={!updatingTemplate}
          onPress={() => setUpdatingTemplate(false)}
        >
          <Text style={styles.menuButtonText}>My Planner</Text>
        </MenuButton>
        <MenuButton
          selected={updatingTemplate}
          onPress={() => setUpdatingTemplate(true)}
        >
          <Text style={styles.menuButtonText}>Routine</Text>
          <Pressable
            style={styles.infoPressable}
            onPress={() => {
              Alert.alert(
                "Tip",
                "Items in your routine will be automatically included in each new week!"
              );
            }}
          >
            <Entypo name="info-with-circle" color={"white"} size={16} />
          </Pressable>
        </MenuButton>
      </View>

      {updatingTemplate ? (
        <WeekDisplay
          week={templates[0]}
          updateWeek={(template: any) => updateTemplates([template])}
        />
      ) : (
        <View>
          {displayedWeeks.map((x: any, i: any) => (
            <WeekDisplay
              week={x}
              updateWeek={(week: any) => updateWeekAtIndex(i, week)}
              hasDates
              key={i}
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

const MenuButton = ({ children, onPress, selected = false }: any) => {
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
    gap: 8,
    marginTop: 5,
    marginHorizontal: 16,
    backgroundColor: "rgba(0,0,0,0.05)",
    borderRadius: 10,
  },
  menuButton: {
    backgroundColor: primaryGreen,
    flex: 1,
    padding: 10,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
    borderRadius: 10,
    borderWidth: 2,
  },
  infoPressable: {
    marginLeft: 5,
    flexDirection: "row",
    alignItems: "center",
  },
  menuButtonText: { color: "white", fontSize: 20 },
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
