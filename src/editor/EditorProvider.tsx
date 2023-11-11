import { createContext, useContext, useEffect, useState } from "react";
import { useToolbar } from "../components/ToolBar";
import { EditToolbar } from "./EditorToolbar";

// Assisted state management via provision of hooks, pertinent to whether app is in edit mode
export const EditProvider = ({ children }) => {
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

const EditContext = createContext(null);

export const useEditing = () => {
  return useContext(EditContext);
};
