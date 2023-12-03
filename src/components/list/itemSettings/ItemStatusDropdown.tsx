import { useEffect, useState } from "react";
import {
  EventStatusOptions,
  ITEM_STATUS_TO_COLOR,
  ItemStatus,
  TaskStatusOptions,
} from "../../list/constants";
import DropDownPicker from "react-native-dropdown-picker";
import Entypo from "react-native-vector-icons/Entypo";

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
        label: x,
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
      textStyle={{
        fontSize: 18,
        color: textColor,
      }}
      style={{
        backgroundColor: ITEM_STATUS_TO_COLOR[localValue],
        borderRadius: 20,
        minHeight: 45,
      }}
      ArrowDownIconComponent={() => (
        <Entypo
          name="chevron-thin-down"
          size={18}
          color={textColor}
          style={{ marginRight: 4 }}
        />
      )}
      ArrowUpIconComponent={() => (
        <Entypo
          name="chevron-thin-up"
          size={18}
          color={textColor}
          style={{ marginRight: 4 }}
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
