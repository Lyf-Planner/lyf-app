import { useState } from "react";
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  TouchableHighlight,
  Alert,
} from "react-native";
import { WeekDisplay } from "./WeekDisplay";
import { mapDatesToWeek, parseDateString } from "../../utils/dates";
import moment from "moment";
import Entypo from "react-native-vector-icons/Entypo";
import { primaryGreen } from "../../utils/constants";

export const Planner = ({
  weeks,
  updateWeeks,
  templates,
  updateTemplates,
}: any) => {
  const [updatingTemplate, setUpdatingTemplate] = useState(false);
  const [displayedWeeks, setDisplayedWeeks] = useState(weeks.slice(0, 1));

  const updateWeekAtIndex = (index: any, week: any) => {
    var modifiedWeeks = weeks;
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
          <Text style={styles.menuButtonText}>My Week</Text>
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
        <View style={{ flexDirection: "column", justifyContent: "center" }}>
          <WeekDisplay
            week={templates[0]}
            updateWeek={(template: any) => updateTemplates([template])}
          />
        </View>
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
          <TouchableHighlight
            onPress={() => addWeek()}
            underlayColor={"rgba(0,0,0,0.5)"}
            style={styles.addWeekTouchable}
          >
            <View style={styles.addWeekView}>
              <Entypo name="chevron-down" size={20} />
              <Text style={{ fontSize: 15 }}>Load another week</Text>
              <Entypo name="chevron-down" size={20} />
            </View>
          </TouchableHighlight>
        </View>
      )}
    </View>
  );
};

const MenuButton = ({ children, onPress, selected = false }: any) => {
  return (
    <Pressable
      style={[
        styles.menuButton,
        { borderColor: selected ? "black" : primaryGreen },
      ]}
      onPress={onPress}
    >
      {children}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  menuButtonRow: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 2,
    paddingHorizontal: 12,
  },
  menuButton: {
    backgroundColor: primaryGreen,
    flex: 1,
    padding: 10,
    margin: 2,
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
  menuButtonText: { color: "white", fontSize: 18 },
  addWeekView: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 0.5,
    gap: 5,
    padding: 15,
    width: 200,
    borderRadius: 10,
  },
  addWeekTouchable: {
    borderRadius: 10,
  },
  addWeekButton: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 8,
  },
});
