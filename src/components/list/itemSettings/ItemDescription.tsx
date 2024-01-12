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

export const ItemDescription = ({
  item,
  updateDesc,
  publishUpdate,
  updateDrawerIndex,
}) => {
  const [textOpen, setTextOpen] = useState(!!item.desc);

  return (
    <View style={styles.mainContainer}>
      <View style={styles.headingContainer}>
        <Text style={styles.headingText}>Description</Text>
        <View style={styles.headerCloseWrapper}>
          {textOpen ? (
            <TouchableHighlight
              onPress={() => {
                setTextOpen(false);
                updateDesc(null);
                updateDrawerIndex(0);
                publishUpdate();
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
                updateDesc("");
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
          value={item.desc}
          onChangeText={updateDesc}
          onFocus={() => updateDrawerIndex(3)}
          onBlur={() => {
            updateDrawerIndex(1);
            publishUpdate();
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
  headingText: { fontSize: 18, fontWeight: "500" },
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
