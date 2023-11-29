import { createContext, useContext, useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableHighlight,
  Pressable,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import { SaveTooltip } from "../components/Icons";
import { Timetable } from "./timetable/TimetableWidget";
import { useAuth } from "../authorisation/AuthProvider";
import { Horizontal } from "../components/MiscComponents";
import { AccountWidget } from "./account/AccountWidget";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { Notes } from "./notes/NotesWidget";
import { EditProvider } from "../editor/EditorProvider";
import SimpleLineIcons from "react-native-vector-icons/SimpleLineIcons";

export enum Widgets {
  Timetable = "Timetable",
  Notes = "Notes",
}

export const WidgetContainer = () => {
  const [selected, updateSelected] = useState<any>(Widgets.Timetable);
  const { updateData, data, logout, deleteMe, lastSave } = useAuth();

  const updateTimetable = (timetable: any) =>
    updateData({ ...data, timetable });
  const updateNotes = (notes: any) => updateData({ ...data, notes });

  const WIDGETS = {
    Timetable: (
      <Timetable timetable={data.timetable} updateTimetable={updateTimetable} />
    ),
    Account: (
      <AccountWidget logout={logout} deleteMe={deleteMe} lastSave={lastSave} />
    ),
    Notes: <Notes notes={data.notes} updateNotes={updateNotes} />,
  };

  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <KeyboardAwareScrollView enableResetScrollToCoords={false}>
        <EditProvider>
          <View style={styles.container}>
            <AppHeaderMenu
              selected={selected}
              updateSelected={updateSelected}
              premiumEnabled={data.premium?.enabled}
            />
            <Horizontal style={styles.headerSeperator} />
            {WIDGETS[selected]}
          </View>
        </EditProvider>
      </KeyboardAwareScrollView>
    </TouchableWithoutFeedback>
  );
};

const AppHeaderMenu = ({ selected, updateSelected, premiumEnabled }) => {
  return (
    <View style={styles.header}>
      <View style={styles.widgetSelect}>
        {Object.keys(Widgets).map((x) => (
          <TouchableHighlight
            style={[
              styles.headerTextContainer,
              selected === x && styles.highlightedHeaderTextContainer,
            ]}
            onPress={() => updateSelected(x)}
            key={x}
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
      <TouchableHighlight
        underlayColor={"rgba(0,0,0,0.4)"}
        style={[
          styles.premiumTooltip,
          {
            backgroundColor: !premiumEnabled
              ? "rgb(31 41 55)"
              : "rgba(0,0,0,0.01)",
          },
        ]}
        onPress={() => updateSelected("Account")}
      >
        <SimpleLineIcons name="diamond" size={30} color={"#2fdce1"} />
      </TouchableHighlight>
      <Pressable
        style={[
          styles.saveTooltip,
          {
            borderBottomWidth: selected === "Account" ? 1 : 0.5,
            borderColor: selected === "Account" ? "black" : "rgba(0,0,0,0.3)",
          },
        ]}
        onPress={() => updateSelected("Account")}
      >
        <SaveTooltip size={40} />
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    maxWidth: 800,
    marginVertical: 55,
    marginHorizontal: 10,
    borderRadius: 10,
    shadowColor: "black",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.5,
    flex: 1,
    paddingVertical: 12,
    backgroundColor: "white",

    flexDirection: "column",
  },
  header: {
    flexDirection: "row",
    height: 50,
    paddingHorizontal: 12,
  },
  headerSeperator: {
    marginTop: 10,
    borderWidth: 4,
    borderRadius: 20,
    marginHorizontal: 12,
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
    width: 120,
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
    marginRight: 8,
  },
  premiumTooltip: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
    width: 50,
    borderWidth: 0.5,
    borderColor: "rgba(0,0,0,0.2)",
    marginLeft: "auto",
    padding: 5,
    borderRadius: 100,
  },
});
