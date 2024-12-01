import { createContext, useContext, useState } from 'react';

type Props = {
  children: JSX.Element;
}

type ModalHooks = {
  closeable: boolean;
  modal: JSX.Element | undefined;
  updateModal: (modal: JSX.Element | undefined, clickOutsideToClose?: boolean) => void;
}

// Component provider
export const ModalProvider = ({ children }: Props) => {
  const [modal, updateModal] = useState<JSX.Element | undefined>(undefined);
  const [closeable, setCloseable] = useState(true);

  const exposed = {
    closeable,
    modal,
    updateModal: (modal: JSX.Element | undefined, clickOutsideToClose: boolean = true) => {
      updateModal(modal);
      setCloseable(clickOutsideToClose);
    }
  };

  return (
    <ModalContext.Provider value={exposed}>
      {children}
    </ModalContext.Provider>
  );
};

const ModalContext = createContext<ModalHooks>(undefined as never);

export const useModal = () => {
  return useContext(ModalContext);
};

