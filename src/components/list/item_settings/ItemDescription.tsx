import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableHighlight,
} from "react-native";
import { offWhite, sleep } from "../../../utils/constants";
import { useEffect, useState } from "react";
import Entypo from "react-native-vector-icons/Entypo";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";

export const ItemDescription = ({
  item,
  updateItem,
  updateDrawerIndex,
  setDescOpen,
}) => {
  const [description, setDescription] = useState(item.desc);

  const updateDescription = () => {
    updateItem({ ...item, desc: description });
  };

  // Move the drawer up if we have a description set
  useEffect(() => {
    sleep(300).then(() => {
      if (item.desc) updateDrawerIndex(1);
    });
  }, []);

  return (
    <View style={styles.mainContainer}>
      <View style={styles.headingContainer}>
        <MaterialIcons name="edit" size={20} />
        <Text style={styles.headingText}>Description</Text>
        <View style={styles.headerCloseWrapper}>
          <TouchableHighlight
            onPress={() => {
              setDescOpen(false);
              setDescription(null);
              updateItem({ ...item, desc: null });
              updateDrawerIndex(0);
            }}
            underlayColor={"rgba(0,0,0,0.5)"}
            style={{ borderRadius: 5 }}
          >
            <Entypo name="cross" color="rgba(0,0,0,0.2)" size={20} />
          </TouchableHighlight>
        </View>
      </View>
      <TextInput
        value={description}
        onChangeText={setDescription}
        onFocus={() => updateDrawerIndex(3)}
        onBlur={() => {
          updateDrawerIndex(1);
          updateDescription();
        }}
        style={styles.itemDesc}
        multiline
      />
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flexDirection: "column",
    gap: 8,
    zIndex: 0,
  },
  headingContainer: {
    height: 35,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  headingText: { fontSize: 20, fontWeight: "500", fontFamily: "InterSemi" },
  headerCloseWrapper: { marginLeft: "auto", marginRight: 10 },
  itemDesc: {
    height: 150,
    backgroundColor: offWhite,
    borderColor: "rgba(0,0,0,0.1)",
    borderWidth: 1,
    borderRadius: 10,
    padding: 8,
    fontSize: 16,
  },
  addDescriptionContainer: {
    backgroundColor: "rgba(0,0,0,0.08)",
    marginLeft: "auto",
    padding: 8.75,
    position: "relative",
    left: 10,
    borderRadius: 8,
    flexDirection: "row",
    alignItems: "center",
  },
  addDescriptionText: {
    fontSize: 16,
    textAlignVertical: "center",
  },
});
