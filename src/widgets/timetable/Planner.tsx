import { useState } from "react";
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  TouchableHighlight,
} from "react-native";
import { WeekDisplay } from "./WeekDisplay";
import { mapDatesToWeek, parseDateString } from "../../utils/dates";
import moment from "moment";
import Entypo from "react-native-vector-icons/Entypo";

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
        { borderColor: "black", borderWidth: selected ? 2 : 0 },
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
  },
  menuButton: {
    backgroundColor: "rgb(21 128 61)",
    flex: 1,
    padding: 10,
    margin: 2,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
    borderRadius: 10,
  },
  menuButtonText: { color: "white", fontSize: 17 },
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
