import { createContext, useContext, useState } from "react";
import { TouchableWithoutFeedback } from "react-native";
import { StyleSheet, View } from "react-native";

// Component provider
export const ModalProvider = ({ children }) => {
  const [modal, updateModal] = useState<any>(null);

  const EXPOSED = {
    modal,
    updateModal,
  };

  const modalExists = !!modal;

  return (
    <ModalContext.Provider value={EXPOSED}>
      {children}
      {modalExists && <View style={styles.modalPositioning}>{modal}</View>}
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
