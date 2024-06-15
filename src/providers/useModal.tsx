import { Dispatch, SetStateAction, createContext, useContext, useState } from 'react';
import { StyleSheet, View } from 'react-native';

type Props = {
  children: JSX.Element;
}

type ModalHooks = {
  modal: JSX.Element | undefined;
  updateModal: (modal: JSX.Element|undefined) => void;
}

// Component provider
export const ModalProvider = ({ children }: Props) => {
  const [modal, updateModal] = useState<JSX.Element|undefined>(undefined);

  const exposed = {
    modal,
    updateModal
  };

  return (
    <ModalContext.Provider value={exposed}>
      {children}
      {!!modal && <View style={styles.modalPositioning}>{modal}</View>}
    </ModalContext.Provider>
  );
};

const ModalContext = createContext<ModalHooks | undefined>(undefined);

export const useModal = () => {
  return useContext(ModalContext) as ModalHooks;
};

const styles = StyleSheet.create({
  modalPositioning: {
    zIndex: 50,
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.4)'
  }
});
