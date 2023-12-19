import { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableHighlight,
  Pressable,
} from "react-native";
import { SaveTooltip } from "../components/Icons";
import { Timetable } from "./timetable/TimetableWidget";
import { useAuth } from "../authorisation/AuthProvider";
import { Horizontal } from "../components/MiscComponents";
import { AccountWidget } from "./account/AccountWidget";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { Notes } from "./notes/NotesWidget";
import { PremiumHeaderButton } from "./premium/PremiumHeaderButton";

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
    <KeyboardAwareScrollView enableResetScrollToCoords={false}>
      <View style={styles.container}>
        <AppHeaderMenu selected={selected} updateSelected={updateSelected} />
        <Horizontal style={styles.headerSeperator} />
        {WIDGETS[selected]}
      </View>
    </KeyboardAwareScrollView>
  );
};

const AppHeaderMenu = ({ selected, updateSelected }) => {
  return (
    <View style={styles.header}>
      {Object.keys(Widgets).map((x) => (
        <MenuWidgetButton
          selected={selected}
          onSelect={() => updateSelected(x)}
          title={x}
        />
      ))}
      <PremiumHeaderButton />
      <Pressable
        style={[
          styles.settingButton,
          {
            backgroundColor: selected === "Account" ? "rgba(0,0,0,0.2)" : "rgba(0,0,0,0.1)",
          },
        ]}
        onPress={() => updateSelected("Account")}
      >
        <SaveTooltip size={35} style={{ position: "relative", right: 3, }} />
      </Pressable>
    </View>
  );
};

export const MenuWidgetButton = ({ selected, onSelect, title }) => {
  return (
    <TouchableHighlight
      style={[
        styles.headerTextContainer,
        selected === title && styles.highlightedHeaderTextContainer,
      ]}
      onPress={onSelect}
    >
      <Text
        style={[
          styles.headerText,
          selected === title && styles.highlightedHeaderText,
        ]}
      >
        {title}
      </Text>
    </TouchableHighlight>
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
    backgroundColor: "rgba(255,255,255,1)",

    flexDirection: "column",
  },
  header: {
    flexDirection: "row",
    height: 50,
    paddingHorizontal: 12,
    gap: 8,
  },
  headerSeperator: {
    marginTop: 10,
    borderWidth: 4,
    borderRadius: 20,
    marginHorizontal: 12,
  },
  widgetSelect: {},
  headerTextContainer: {
    borderRadius: 10,
    paddingVertical: 4,
    paddingHorizontal: 8,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    height: 50,
    borderColor: "rgba(50,50,50,0.25)",
    backgroundColor: "white",
    borderWidth: 1,
    flex: 1,
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
  settingButton: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
    overflow: "hidden",
    marginLeft: "auto",
    marginRight: 8,

    width: 50,
    borderRadius: 50,
  },
});
