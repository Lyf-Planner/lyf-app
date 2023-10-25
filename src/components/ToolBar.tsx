import { createContext, useContext, useState } from "react";
import { StyleSheet, View } from "react-native";

export const ToolbarProvider = ({ children }) => {
  const [toolbar, updateToolbar] = useState(null);

  return (
    <ToolbarContext.Provider value={{ updateToolbar }}>
      {children}
      {toolbar && <View style={styles.fixToBottom}>{toolbar}</View>}
    </ToolbarContext.Provider>
  );
};

const ToolbarContext = createContext(null);

export const useToolbar = () => {
  return useContext(ToolbarContext);
};

const styles = StyleSheet.create({
  fixToBottom: {
    position: "absolute",
    bottom: 0,
    right: 0,
    left: 0,
    flexDirection: "row",
    justifyContent: "center",
  },
});
