import { StyleSheet, View } from "react-native";
import { ListItemType, inProgressColor } from "../constants";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";

export const InProgressUnderlay = ({ item }) => {
  const conditionalStyles = {
    itemUnderlay: {
      borderRadius: item.type !== ListItemType.Task ? 5 : 15,
    },
  };

  return (
    <View
      style={[conditionalStyles.itemUnderlay, styles.itemUnderlay]}
    >
      {/* 
// @ts-ignore */}
      <FontAwesome5 name="play" size={20} style={styles.playIcon} />
    </View>
  );
};

const styles = StyleSheet.create({
  itemUnderlay: {
    height: 54,
    width: 75,
    borderWidth: 1,
    flexDirection: "row",
    backgroundColor: inProgressColor,
    alignItems: "center",
    justifyContent: "flex-start",
  },
  playIcon: { marginLeft: 10 },
});
