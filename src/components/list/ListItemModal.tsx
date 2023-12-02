import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput,
} from "react-native";
import { Horizontal } from "../../components/MiscComponents";
import { eventsBadgeColor, offWhite } from "../../utils/constants";
import { useModal } from "../../components/ModalProvider";
import { useState } from "react";
import {
  EventStatusOptions,
  ITEM_STATUS_TO_COLOR,
  ItemStatus,
  TaskStatusOptions,
} from "./constants";
import DateTimePicker from "@react-native-community/datetimepicker";
import DropDownPicker from "react-native-dropdown-picker";
import moment from "moment";

export const ListItemModal = ({ item, updateItem, isEvent, removeItem }) => {
  const { updateModal } = useModal();

  const closeModal = () => updateModal(null);

  const updateStatus = (status) => updateItem({ ...item, status });
  const updateName = (name) => updateItem({ ...item, name });
  const updateDesc = (desc) => updateItem({ ...item, desc });
  const updateTime = (time) => updateItem({ ...item, time });

  var today = item.date ? new Date(item.date) : new Date();
  const datePickerValue =
    item.time &&
    new Date(
      `${today.getFullYear()}-${today.getMonth()}-${today.getDate()} ${
        item.time
      }`
    );

  const updateTimeFromPicker = (time) => {
    // Picker gives us a timestamp, that we need to convert to 24 hr time
    var dateTime = new Date(time.nativeEvent.timestamp);
    updateTime(moment(dateTime).format("HH:mm"));
  };

  return (
    <View style={styles.mainContainer}>
      <View style={{ gap: 8, zIndex: 10 }}>
        <TextInput
          value={item.name}
          onChangeText={updateName}
          style={styles.itemName}
          returnKeyType="done"
        />
        <StatusSelector
          status={item.status}
          updateStatus={updateStatus}
          isEvent={isEvent}
        />
      </View>
      <Horizontal style={styles.firstSeperator} />

      {isEvent && (
        <View>
          <View style={{ flexDirection: "row" }}>
            <Text style={{ fontSize: 16, fontWeight: "600" }}>Event Time</Text>
            <DateTimePicker
              value={datePickerValue}
              
              minuteInterval={5}
              mode={"time"}
              is24Hour={true}
              onChange={updateTimeFromPicker}
            />
          </View>
        </View>
      )}

      <View
        style={{
          flexDirection: "column",
          gap: 4,
          zIndex: 0,
        }}
      >
        <Text style={{ fontSize: 16, fontWeight: "600" }}>Description</Text>
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
            onPress={removeItem}
            style={[styles.bottomButton, { backgroundColor: "red" }]}
            activeOpacity={1}
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

const StatusSelector = ({ status, updateStatus, isEvent = false }) => {
  const [open, setOpen] = useState(false);
  const [localValue, setLocalValue] = useState(status || ItemStatus.Upcoming);

  const items = (isEvent ? EventStatusOptions : TaskStatusOptions).map(
    (x: any) => {
      return {
        label: x,
        value: x,
        containerStyle: { backgroundColor: ITEM_STATUS_TO_COLOR[x] },
        labelStyle: {
          color: x === ItemStatus.Done ? "white" : "black",
        },
      };
    }
  );

  return (
    <DropDownPicker
      open={open}
      value={localValue}
      items={items}
      textStyle={{
        fontSize: 18,
        color: localValue === ItemStatus.Done ? "white" : "black",
      }}
      style={{
        backgroundColor: ITEM_STATUS_TO_COLOR[localValue],
        borderRadius: 10,
        minHeight: 45,
      }}
      setOpen={setOpen}
      setValue={setLocalValue} // This prop works in a dumb way - onSelectItem is used for state updates for ease of mind
      listMode={"SCROLLVIEW"}
      dropDownDirection="BOTTOM"
      autoScroll
      multiple={false}
    />
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    backgroundColor: "white",
    paddingHorizontal: 20,
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
    marginTop: 4,
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
  featureContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginLeft: 5,
    marginTop: 12,
    gap: 12,
    width: "65%",
  },
  featureSummary: {
    flexDirection: "column",
    gap: 6,
  },
  featureTitle: {
    fontWeight: "700",
    fontSize: 20,
  },
  featureDesc: {
    fontSize: 15,
    opacity: 0.5,
  },

  itemDesc: {
    height: 150,
    backgroundColor: offWhite,
    borderColor: "rgba(0,0,0,0.1)",
    borderWidth: 1,
    borderRadius: 10,
    padding: 8,
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
