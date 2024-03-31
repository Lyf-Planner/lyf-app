import { StyleSheet, View } from "react-native";
import { ListItemType } from "../constants";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";

export const EditItemUnderlay = ({ item }) => {
  const conditionalStyles = {
    itemUnderlay: {
      borderRadius: item.type !== ListItemType.Task ? 5 : 15,
    },
  };

  return (
    <View style={[conditionalStyles.itemUnderlay, styles.itemUnderlay]}>
      {/* 
    // @ts-ignore */}
      <MaterialIcons name="edit" style={styles.editIcon} size={20} />
    </View>
  );
};

const styles = StyleSheet.create({
  itemUnderlay: {
    height: 54,
    width: 75,
    borderWidth: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    marginLeft: "auto",
    backgroundColor: "white",
  },
  editIcon: { marginLeft: "auto", marginRight: 10, color: "black" },
});
