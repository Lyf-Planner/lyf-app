import { View, Text } from "react-native";
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
    <View
      style={{
        backgroundColor: TYPES_TO_COLOR[type],
        flexDirection: "row",
        paddingVertical: 5,
        paddingHorizontal: 10,
        borderRadius: 20,
        marginLeft: "auto",
      }}
    >
      <Text style={{ fontSize: 15, color: TYPES_TO_TEXT[type] }}>
        {TypeToDisplayName[type]}
      </Text>
    </View>
  );
};
