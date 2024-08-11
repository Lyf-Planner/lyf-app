import { Dispatch, SetStateAction, createContext, useContext, useState } from 'react';

type Props = {
  children: JSX.Element;
}

type ModalHooks = {
  modal: JSX.Element | undefined;
  updateModal: (modal: JSX.Element|undefined) => void;
}

// Component provider
export const ModalProvider = ({ children }: Props) => {
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

