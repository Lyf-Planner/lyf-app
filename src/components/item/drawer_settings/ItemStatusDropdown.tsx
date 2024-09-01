import { useEffect, useState } from 'react';
import {
  StatusOptions,
  ITEM_STATUS_TO_COLOR,
  ItemStatus,
  statusTextDisplay
} from '../../item/constants';
import { StyleSheet } from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import Entypo from 'react-native-vector-icons/Entypo';
import { ItemDrawerProps } from '../ItemDrawer';

export const ItemStatusDropdown = ({ item, updateItem }: ItemDrawerProps) => {
  const [open, setOpen] = useState(false);
  const [localValue, setLocalValue] = useState(
    item.status || ItemStatus.Upcoming
  );

  const updateStatus = (status: ItemStatus) => {
    updateItem(item, { status });
  };

  const items = StatusOptions.map((x) => {
    return {
      label: statusTextDisplay(item.type, x),
      value: x,
      containerStyle: { backgroundColor: ITEM_STATUS_TO_COLOR[x] },
      labelStyle: {
        color: x === ItemStatus.Done ? 'white' : 'black'
      }
    };
  });

  const textColor = localValue === ItemStatus.Done ? 'white' : 'black';

  useEffect(() => {
    if (item.status && localValue !== item.status) {
      updateStatus(localValue);
    }
  }, [localValue]);

  useEffect(() => {
    setLocalValue(item.status);
  }, [item]);

  return (
    <DropDownPicker
      open={open}
      value={localValue}
      items={items}
      textStyle={[styles.dropdownText, { color: textColor }]}
      style={[
        styles.dropdown,
        {
          backgroundColor: ITEM_STATUS_TO_COLOR[localValue]
        }
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
      listMode={'SCROLLVIEW'}
      dropDownDirection="BOTTOM"
      autoScroll
      multiple={false}
    />
  );
};

const styles = StyleSheet.create({
  dropdownText: {
    fontSize: 18
  },
  dropdown: {
    borderRadius: 15,
    minHeight: 45,
    borderWidth: 0
  },
  dropdownArrow: { marginRight: 4 }
});
