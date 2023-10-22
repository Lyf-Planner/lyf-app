import { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableHighlight,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import { SaveTooltip } from "../components/Tooltip";
import { Timetable } from "./TimetableWidget";
import { useAuth } from "../authorisation/AuthProvider";
import { Horizontal } from "../components/MiscComponents";

export enum Widgets {
  Timetable = "Timetable",
  Notes = "Notes",
}

export const WidgetContainer = () => {
  const [selected, updateSelected] = useState<any>(Widgets.Timetable);
  const { updateData, data } = useAuth();

  const updateTimetable = (timetable: any) =>
    updateData({ ...data, timetable });
  const updateNotes = (notes: any) => updateData({ ...data, notes });

  const WIDGETS = {
    Timetable: (
      <Timetable timetable={data.timetable} updateTimetable={updateTimetable} />
    ),
  };

  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <View style={styles.container}>
        <View style={styles.header}>
          <View style={styles.widgetSelect}>
            {Object.keys(Widgets).map((x) => (
              <TouchableHighlight
                style={[
                  styles.headerTextContainer,
                  selected === x && styles.highlightedHeaderTextContainer,
                ]}
                onPress={() => updateSelected(x)}
              >
                <Text
                  style={[
                    styles.headerText,
                    selected === x && styles.highlightedHeaderText,
                  ]}
                >
                  {x}
                </Text>
              </TouchableHighlight>
            ))}
          </View>
          <SaveTooltip style={styles.saveTooltip} size={40} />
        </View>
        <Horizontal
          style={{ marginVertical: 10, borderWidth: 4, borderRadius: 20 }}
        />
        {WIDGETS[selected]}
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    maxWidth: 800,
    marginTop: 50,
    marginHorizontal: 15,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    shadowColor: "black",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.5,
    flex: 1,
    padding: 15,
    backgroundColor: "rgb(241 245 249)",
    flexDirection: "column",
  },
  header: {
    flexDirection: "row",
    height: 50,
  },
  widgetSelect: {
    flexDirection: "row",
    gap: 4,
    justifyContent: "flex-start",
  },
  headerTextContainer: {
    borderRadius: 10,
    paddingVertical: 4,
    paddingHorizontal: 8,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    width: 125,
    height: 50,
    borderColor: "rgba(50,50,50,0.25)",
    borderWidth: 1,
  },
  highlightedHeaderTextContainer: {
    backgroundColor: "black",
  },
  highlightedHeaderText: {
    color: "white",
  },
  headerText: {
    fontSize: 20,
    fontWeight: "bold",
  },
  saveTooltip: {
    alignItems: "center",
    marginTop: 4,
    marginLeft: "auto",
    marginRight: 10,
  },
});
