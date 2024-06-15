import { createContext, useContext, useState } from 'react';
import { TutorialOverlay } from '../pages/tutorial/TutorialOverlay';
import { useAuth } from '../authorisation/AuthProvider';

type Props = {
  children: JSX.Element;
}

type TutorialHooks = {
  updateTutorial: (show: boolean) => void;
}

// Component provider
export const TutorialProvider = ({ children }: Props) => {
  const [tutorial, updateTutorial] = useState(false);

  const exposed = {
    updateTutorial
  };

  return (
    <TutorialContext.Provider value={exposed}>
      {tutorial ? <TutorialOverlay /> : children}
    </TutorialContext.Provider>
  );
};

const TutorialContext = createContext<TutorialHooks | undefined>(undefined);

export const useTutorial = () => {
  return useContext(TutorialContext) as TutorialHooks;
};
