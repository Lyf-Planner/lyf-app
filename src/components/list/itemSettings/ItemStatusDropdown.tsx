import { useEffect, useState } from "react";
import {
  EventStatusOptions,
  ITEM_STATUS_TO_COLOR,
  ItemStatus,
  ListItemType,
  TaskStatusOptions,
  statusTextDisplay,
} from "../../list/constants";
import DropDownPicker from "react-native-dropdown-picker";
import Entypo from "react-native-vector-icons/Entypo";
import { StyleSheet } from "react-native";

export const ItemStatusDropdown = ({
  status,
  updateStatus,
  isEvent = false,
}) => {
  const [open, setOpen] = useState(false);
  const [localValue, setLocalValue] = useState(status || ItemStatus.Upcoming);

  const items = (isEvent ? EventStatusOptions : TaskStatusOptions).map(
    (x: any) => {
      return {
        label: statusTextDisplay(
          isEvent ? ListItemType.Event : ListItemType.Task,
          x
        ),
        value: x,
        containerStyle: { backgroundColor: ITEM_STATUS_TO_COLOR[x] },
        labelStyle: {
          color: x === ItemStatus.Done ? "white" : "black",
        },
      };
    }
  );

  const textColor = localValue === ItemStatus.Done ? "white" : "black";

  useEffect(() => {
    updateStatus(localValue);
  }, [localValue]);

  return (
    <DropDownPicker
      open={open}
      value={localValue}
      items={items}
      textStyle={[styles.dropdownText, { color: textColor }]}
      style={[
        styles.dropdown,
        {
          backgroundColor: ITEM_STATUS_TO_COLOR[localValue],
        },
      ]}
      ArrowDownIconComponent={() => (
        <Entypo
          name="chevron-thin-down"
          size={18}
          color={textColor}
          style={styles.dropdownArrow}
        />
      )}
      ArrowUpIconComponent={() => (
        <Entypo
          name="chevron-thin-up"
          size={18}
          color={textColor}
          style={styles.dropdownArrow}
        />
      )}
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
  dropdownText: {
    fontSize: 18,
  },
  dropdown: { borderRadius: 20, minHeight: 45 },
  dropdownArrow: { marginRight: 4 },
});
