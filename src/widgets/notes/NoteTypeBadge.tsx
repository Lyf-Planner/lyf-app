import { View, Text, StyleSheet } from "react-native";
import { eventsBadgeColor, primaryGreen } from "../../utils/constants";
import { NoteTypes, TypeToDisplayName } from "./TypesAndHelpers";

const TYPES_TO_COLOR = {
  Text: primaryGreen,
  List: eventsBadgeColor,
};

const TYPES_TO_TEXT = {
  Text: "white",
  List: "black",
};

export const NoteTypeBadge = ({ type }) => {
  return (
    <View style={[styles.main, { backgroundColor: TYPES_TO_COLOR[type] }]}>
      <Text style={{ fontSize: 15, color: TYPES_TO_TEXT[type] }}>
        {TypeToDisplayName[type]}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  main: {
    flexDirection: "row",
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 20,
    marginLeft: "auto",
  },
});
