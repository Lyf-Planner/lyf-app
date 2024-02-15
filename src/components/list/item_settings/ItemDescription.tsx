import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableHighlight,
} from "react-native";
import { offWhite } from "../../../utils/constants";
import { useState } from "react";
import Entypo from "react-native-vector-icons/Entypo";

export const ItemDescription = ({ item, updateItem, updateDrawerIndex }) => {
  const [description, setDescription] = useState(item.desc);
  const [textOpen, setTextOpen] = useState(!!description);

  const updateDescription = () => {
    updateItem({ ...item, desc: description });
  };

  return (
    <View style={styles.mainContainer}>
      <View style={styles.headingContainer}>
        <Text style={styles.headingText}>Description</Text>
        <View style={styles.headerCloseWrapper}>
          {textOpen ? (
            <TouchableHighlight
              onPress={() => {
                setTextOpen(false);
                setDescription(null);
                updateDescription();
                updateDrawerIndex(0);
              }}
              underlayColor={"rgba(0,0,0,0.5)"}
              style={{ borderRadius: 5 }}
            >
              <Entypo name="cross" color="rgba(0,0,0,0.2)" size={20} />
            </TouchableHighlight>
          ) : (
            <TouchableHighlight
              style={styles.addDescriptionContainer}
              underlayColor={"rgba(0,0,0,0.5)"}
              onPress={() => {
                setTextOpen(true);
                setDescription(null);
                updateDescription();
                updateDrawerIndex(1);
              }}
            >
              <Text style={styles.addDescriptionText}>Add Desc +</Text>
            </TouchableHighlight>
          )}
        </View>
      </View>
      {textOpen && (
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
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flexDirection: "column",
    gap: 8,
    zIndex: 0,
  },
  headingContainer: { height: 35, flexDirection: "row", alignItems: "center" },
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
