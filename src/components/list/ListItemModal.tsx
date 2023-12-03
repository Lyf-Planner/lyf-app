import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput,
} from "react-native";
import { Horizontal } from "../../components/MiscComponents";
import { eventsBadgeColor, offWhite } from "../../utils/constants";
import { ItemStatus } from "./constants";

import { ItemStatusDropdown } from "./itemSettings/ItemStatusDropdown";
import { useState } from "react";
import { ItemEventTime } from "./itemSettings/ItemEventTime";
import { ItemNotification } from "./itemSettings/ItemNotification";

export const ListItemModal = ({
  initialItem,
  updateRootItem,
  isEvent,
  removeItem,
  closeModal,
}) => {
  // Due to state issues, we need a local copy of the item
  // It is important this is eventually addressed when we introduce redux and decouple items
  // This is a workaround !!
  const [item, updateLocalItem] = useState(initialItem);
  const updateItem = (x: any) => {
    updateLocalItem(x);
    updateRootItem(x);
  };

  const updateStatus = (status) =>
    updateItem({ ...item, status, finished: status === ItemStatus.Done });
  const updateName = (name) => updateItem({ ...item, name });
  const updateDesc = (desc) => updateItem({ ...item, desc });
  const updateTime = (time) => {
    updateItem({ ...item, time });
  };

  return (
    <View style={styles.mainContainer}>
      <View style={{ gap: 10, zIndex: 10 }}>
        <TextInput
          value={item.name}
          onChangeText={updateName}
          style={styles.itemName}
          returnKeyType="done"
        />
        <ItemStatusDropdown
          status={item.status}
          updateStatus={updateStatus}
          isEvent={isEvent}
        />
      </View>
      <Horizontal style={styles.firstSeperator} />

      <View
        style={{
          flexDirection: "column",
          gap: 2,
        }}
      >
        <ItemEventTime time={item.time} updateTime={updateTime} />
        <ItemNotification item={item} updateItem={updateItem} />
      </View>

      <View
        style={{
          flexDirection: "column",
          gap: 8,
          zIndex: 0,
        }}
      >
        <Text style={{ fontSize: 18, fontWeight: "600" }}>Description</Text>
        <TextInput
          value={item.desc}
          onChangeText={updateDesc}
          style={styles.itemDesc}
          returnKeyType="done"
          multiline
        />
      </View>

      <View style={styles.footer}>
        <Horizontal style={styles.secondSeperator} />
        <View style={styles.bottomButtonsContainer}>
          <TouchableOpacity
            onPress={() => {
              removeItem();
              closeModal();
            }}
            style={[styles.bottomButton, { backgroundColor: "red" }]}
            activeOpacity={0.7}
          >
            <Text style={[styles.bottomButtonText, styles.removeText]}>
              Remove
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={closeModal}
            style={[styles.bottomButton, { backgroundColor: eventsBadgeColor }]}
            activeOpacity={0.7}
          >
            <Text style={[styles.bottomButtonText, styles.doneText]}>Done</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    backgroundColor: "white",
    paddingHorizontal: 18,
    paddingTop: 25,
    marginHorizontal: 90,
    borderColor: "rgba(0,0,0,0.5)",
    borderWidth: 1,
    borderRadius: 10,
    gap: 10,
    shadowColor: "black",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 10,
  },
  header: {
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    gap: 4,
    marginBottom: 4,
  },
  firstSeperator: {
    opacity: 0.25,
    marginTop: 2,
    marginBottom: 2,
    borderWidth: 2,
  },
  itemName: {
    fontSize: 20,
    backgroundColor: "rgba(0,0,0,0.95)",
    padding: 10,
    height: 50,
    fontWeight: "600",
    width: "100%",
    borderRadius: 5,
    color: "white",
  },
  subtitle: {
    textAlign: "center",
    opacity: 0.6,
    fontWeight: "600",
    fontSize: 15,
  },

  itemDesc: {
    height: 150,
    backgroundColor: offWhite,
    borderColor: "rgba(0,0,0,0.1)",
    borderWidth: 1,
    borderRadius: 10,
    padding: 8,
    fontSize: 16,
  },

  secondSeperator: { opacity: 0.2, marginTop: 16, borderWidth: 2 },
  footer: { gap: 10, position: "relative", bottom: 10 },
  bottomButtonsContainer: { flexDirection: "row", gap: 5, marginTop: 6 },
  bottomButton: {
    padding: 12,
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 0.5,
    borderRadius: 10,
  },
  bottomButtonText: {
    fontSize: 16,
    textAlign: "center",
  },
  doneText: { fontWeight: "600" },
  removeText: { color: "white" },
});
function updateModal(arg0: null) {
  throw new Error("Function not implemented.");
}
