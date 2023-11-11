import { StyleSheet, View, Text, TouchableHighlight } from "react-native";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";

export const EditToolbar = ({
  selectedItem,
  selectedList,
  clipboard,
  updateEditMode,
  updateSelectedItem,
  updateClipboard,
}) => {
  const TOOLS = {
    Edit: {
      enabled: !!selectedItem,
      operation: () => {
        selectedItem?.updateEditText(true);
      },
      iconName: "edit",
    },
    Cut: {
      enabled: !!selectedItem,
      operation: () => {
        updateClipboard(selectedItem?.item);
        selectedItem?.onRemove();
        updateSelectedItem(null);
      },
      iconName: "content-cut",
    },
    Paste: {
      enabled: !!clipboard && !!selectedList,
      operation: () => {
        selectedList?.addNewItem(clipboard);
      },
      iconName: "content-paste",
    },
  };

  const exitEditMode = () => {
    updateSelectedItem(null);
    updateEditMode(false);
  };

  return (
    <View style={styles.editingToolbar}>
      <Text style={styles.editModeText}>Edit Mode</Text>
      <View style={styles.tools}>
        {Object.keys(TOOLS).map((x: string) => (
          <Tool
            name={x}
            icon={
              <MaterialIcons
                name={TOOLS[x].iconName}
                size={20}
                color={TOOLS[x].enabled ? "white" : "black"}
              />
            }
            operation={TOOLS[x].operation}
            available={TOOLS[x].enabled}
          />
        ))}
      </View>

      <View style={styles.doneButton}>
        <TouchableHighlight
          style={styles.doneTouchableHighlight}
          underlayColor={"rgba(0,0,0,0.5)"}
          onPress={exitEditMode}
        >
          <Text style={styles.doneText}>Done</Text>
        </TouchableHighlight>
      </View>
    </View>
  );
};

export const Tool = ({ icon, name, operation, available }) => {
  return (
    <TouchableHighlight
      onPress={operation}
      disabled={!available}
      style={styles.toolTouchableHighlight}
      underlayColor="rgba(255,255,255,0.5)"
    >
      <View style={styles.tool}>
        {icon}
        <Text
          style={{
            color: available ? "white" : "black",
          }}
        >
          {name}
        </Text>
      </View>
    </TouchableHighlight>
  );
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
