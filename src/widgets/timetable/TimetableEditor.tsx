import { createContext, useContext, useEffect, useState } from "react";
import { StyleSheet, View, Text, TouchableHighlight } from "react-native";
import { useToolbar } from "../../components/ToolBar";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import AntDesign from "react-native-vector-icons/AntDesign";

// Assisted state management via provision of hooks, pertinent to whether the timetable is in edit mode
export const TimetableEditProvider = ({ children }) => {
  const [editMode, updateEditMode] = useState(false);
  const [selectedItem, updateSelectedItem] = useState(null);
  const [selectedRegion, updateSelectedRegion] = useState(null);
  const [clipboard, updateClipboard] = useState(null);

  const { updateToolbar } = useToolbar();
  
  const EXPOSED = {
    editMode,
    selectedItem,
    updateSelectedItem,
    updateEditMode,
  };

  useEffect(() => {
    if (editMode)
      updateToolbar(
        <EditToolbar
          itemProps={selectedItem}
          clipboard={clipboard}
          updateEditMode={updateEditMode}
          updateSelectedItem={updateSelectedItem}
          updateClipboard={updateClipboard}
        />
      );
    else updateToolbar(null);
  }, [editMode, selectedItem, updateSelectedItem]);

  return (
    <EditContext.Provider value={EXPOSED}>{children}</EditContext.Provider>
  );
};

const EditToolbar = ({
  itemProps,
  clipboard,
  updateEditMode,
  updateSelectedItem,
  updateClipboard,
}) => {
  return (
    <View style={styles.editingToolbar}>
      <Text style={styles.editModeText}>Edit Mode</Text>
      <View style={styles.tools}>
        <TouchableHighlight
          onPress={() => itemProps.editTextAndFocus()}
          disabled={!itemProps}
          style={styles.toolTouchableHighlight}
          underlayColor="rgba(255,255,255,0.5)"
        >
          <View style={styles.tool}>
            <MaterialIcons
              name="edit"
              size={20}
              color={!!itemProps ? "white" : "black"}
            />
            <Text style={{ color: !!itemProps ? "white" : "black" }}>Edit</Text>
          </View>
        </TouchableHighlight>
        <TouchableHighlight
          onPress={() => {
            updateClipboard(itemProps);
            itemProps?.onRemove();
            updateSelectedItem(null);
          }}
          disabled={!itemProps}
          style={styles.toolTouchableHighlight}
          underlayColor="rgba(255,255,255,0.5)"
        >
          <View style={styles.tool}>
            <MaterialIcons
              name="content-cut"
              size={20}
              color={!!itemProps ? "white" : "black"}
            />
            <Text style={{ color: !!itemProps ? "white" : "black" }}>Cut</Text>
          </View>
        </TouchableHighlight>
        <TouchableHighlight
          onPress={() => {
            itemProps?.updateFinished(!itemProps?.finished);
            updateSelectedItem({
              ...itemProps,
              finished: !itemProps?.finished,
            });
          }}
          style={styles.toolTouchableHighlight}
          underlayColor="rgba(255,255,255,0.5)"
        >
          <View style={styles.tool}>
            <MaterialIcons
              name="content-paste"
              size={20}
              color={!!itemProps ? "white" : "black"}
            />
            <Text style={{ color: !!itemProps ? "white" : "black" }}>
              Paste
            </Text>
          </View>
        </TouchableHighlight>
      </View>

      <View style={styles.doneButton}>
        <TouchableHighlight
          style={styles.doneTouchableHighlight}
          underlayColor={"rgba(0,0,0,0.5)"}
          onPress={() => {
            updateSelectedItem(null);
            updateEditMode(false);
          }}
        >
          <Text style={styles.doneText}>Done</Text>
        </TouchableHighlight>
      </View>
    </View>
  );
};

const EditContext = createContext(null);

export const useEditing = () => {
  return useContext(EditContext);
};
const styles = StyleSheet.create({
  editingToolbar: {
    zIndex: 50,
    paddingHorizontal: 15,
    paddingBottom: 35,
    paddingTop: 15,
    backgroundColor: "red",
    flex: 1,

    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
  },
  editModeText: {
    fontSize: 20,
    fontWeight: "700",
    color: "white",
    width: 60,
    textAlign: "center",
  },
  tools: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  tool: {
    flexDirection: "column",
    justifyContent: "space-evenly",
    alignItems: "center",
    borderWidth: 0.5,
    padding: 10,
    borderRadius: 40,
    width: 65,
    height: 65,
  },
  toolTouchableHighlight: {
    borderRadius: 40,
    width: 65,
    height: 65,
  },
  doneButton: {
    borderRadius: 10,
    backgroundColor: "white",
    height: 45,
  },
  doneTouchableHighlight: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 10,
  },
  doneText: {
    color: "black",
    fontSize: 18,
  },
});
