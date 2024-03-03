import { useRef } from "react";
import { StyleSheet, View } from "react-native";
import {
  Menu,
  MenuOptions,
  MenuOption,
  MenuTrigger,
  renderers,
} from "react-native-popup-menu";
import { Horizontal } from "../../components/MiscComponents";
import { NoteTypes } from "./TypesAndHelpers";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

const NewNoteButton = () => {
  return (
    <View style={{ padding: 4, borderRadius: 5 }}>
      {/* 
        // @ts-ignore */}
      <MaterialCommunityIcons name="note-plus-outline" size={30} />
    </View>
  );
};

export const NewNoteMenu = ({ addNote }) => {
  const onOptionSelect = (type: NoteTypes) => {
    addNote(`New ${type}`, type);
    return false;
  };

  const menu = useRef<any>();

  return (
    <View>
      <Menu
        onSelect={(value) => onOptionSelect(value)}
        name="new-note-menu"
        ref={menu}
        renderer={renderers.Popover}
        rendererProps={{
          placement: "bottom",
          anchorStyle: { backgroundColor: "#bababa" },
        }}
      >
        <MenuOptions
          customStyles={{ optionsContainer: styles.optionsContainer }}
        >
          <MenuOption
            value={1}
            text="+ New List"
            customStyles={{
              optionWrapper: styles.optionWrapper,
              optionText: styles.optionText,
            }}
            onSelect={() => addNote(NoteTypes.List)}
          />
          <Horizontal style={styles.optionSeperator} />
          <MenuOption
            value={2}
            text="+ New Note"
            customStyles={{
              optionWrapper: styles.optionWrapper,
              optionText: styles.optionText,
            }}
            onSelect={() => addNote(NoteTypes.Text)}
          />
        </MenuOptions>
        <MenuTrigger>
          <NewNoteButton />
        </MenuTrigger>
      </Menu>
    </View>
  );
};

const styles = StyleSheet.create({
  optionsContainer: {
    flexDirection: "column",
    justifyContent: "space-evenly",
    paddingLeft: 0,
    borderRadius: 10,
    borderWidth: 0.5,
    borderColor: "rgba(0,0,0,0.5)",
  },
  optionWrapper: { marginVertical: 4, marginHorizontal: 8 },
  optionText: { fontSize: 18 },
  optionSeperator: { marginHorizontal: 5 },
});
