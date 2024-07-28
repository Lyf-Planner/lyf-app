import { Dispatch, SetStateAction, createContext, useContext, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';

type Props = {
  children: JSX.Element;
}

type ModalHooks = {
  modal: JSX.Element | undefined;
  updateModal: (modal: JSX.Element|undefined) => void;
}

// Component provider
export const ModalProvider = ({ children }: Props) => {
  console.log('rendering modal provider');

  const [modal, updateModal] = useState<JSX.Element | undefined>(undefined);

  const exposed = {
    modal,
    updateModal
  };

  return (
    <ModalContext.Provider value={exposed}>
      {children}
    </ModalContext.Provider>
  );
};

const ModalContext = createContext<ModalHooks>(undefined as any);

export const useModal = () => {
  return useContext(ModalContext);
};

