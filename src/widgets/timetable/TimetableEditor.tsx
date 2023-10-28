import { createContext, useContext, useEffect, useState } from "react";
import { StyleSheet, View, Text, TouchableHighlight } from "react-native";
import { useToolbar } from "../../components/ToolBar";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import AntDesign from "react-native-vector-icons/AntDesign";

// Assisted state management via provision of hooks, pertinent to whether the timetable is in edit mode
export const TimetableEditProvider = ({ children }) => {
  const [editMode, updateEditMode] = useState(false);
  const [selectedItem, updateSelectedItem] = useState(null);
  const [selectedList, updateSelectedList] = useState(null);
  const [clipboard, updateClipboard] = useState(null);

  const { updateToolbar } = useToolbar();

  const EXPOSED = {
    editMode,
    selectedItem,
    selectedList,
    updateSelectedItem,
    updateEditMode,
    updateSelectedList,
  };

  useEffect(() => {
    if (editMode)
      updateToolbar(
        <EditToolbar
          selectedItem={selectedItem}
          selectedList={selectedList}
          clipboard={clipboard}
          updateEditMode={updateEditMode}
          updateSelectedItem={updateSelectedItem}
          updateClipboard={updateClipboard}
        />
      );
    else {
      updateToolbar(null);
      updateSelectedItem(null);
      updateSelectedList(null);
    }
  }, [editMode, selectedItem, selectedList, clipboard]);

  return (
    <EditContext.Provider value={EXPOSED}>{children}</EditContext.Provider>
  );
};

const EditToolbar = ({
  selectedItem,
  selectedList,
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
          onPress={() => {
            selectedItem?.updateEditText(true);
          }}
          disabled={!selectedItem}
          style={styles.toolTouchableHighlight}
          underlayColor="rgba(255,255,255,0.5)"
        >
          <View style={styles.tool}>
            <MaterialIcons
              name="edit"
              size={20}
              color={!!selectedItem ? "white" : "black"}
            />
            <Text style={{ color: !!selectedItem ? "white" : "black" }}>
              Edit
            </Text>
          </View>
        </TouchableHighlight>
        <TouchableHighlight
          onPress={() => {
            updateClipboard(selectedItem?.item);
            selectedItem?.onRemove();
            updateSelectedItem(null);
          }}
          disabled={!selectedItem}
          style={styles.toolTouchableHighlight}
          underlayColor="rgba(255,255,255,0.5)"
        >
          <View style={styles.tool}>
            <MaterialIcons
              name="content-cut"
              size={20}
              color={!!selectedItem ? "white" : "black"}
            />
            <Text style={{ color: !!selectedItem ? "white" : "black" }}>
              Cut
            </Text>
          </View>
        </TouchableHighlight>
        <TouchableHighlight
          onPress={() => {
            selectedList?.addNewItem(clipboard);
          }}
          style={styles.toolTouchableHighlight}
          underlayColor="rgba(255,255,255,0.5)"
        >
          <View style={styles.tool}>
            <MaterialIcons
              name="content-paste"
              size={20}
              color={!!clipboard && !!selectedList ? "white" : "black"}
            />
            <Text
              style={{
                color: !!clipboard && !!selectedList ? "white" : "black",
              }}
            >
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
