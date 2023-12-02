import { createContext, useContext, useState } from "react";
import { StyleSheet, View } from "react-native";

// Assisted state management via provision of hooks, pertinent to whether app is in edit mode
export const ModalProvider = ({ children }) => {
  const [modal, updateModal] = useState<any>(null);

  const EXPOSED = {
    modal,
    updateModal,
  };

  return (
    <ModalContext.Provider value={EXPOSED}>
      {children}
      {!!modal && <View style={styles.modalPositioning}>{modal}</View>}
    </ModalContext.Provider>
  );
};

const ModalContext = createContext(null);

export const useModal = () => {
  return useContext(ModalContext);
};

const styles = StyleSheet.create({
  modalPositioning: {
    zIndex: 50,
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.4)",
  },
});
