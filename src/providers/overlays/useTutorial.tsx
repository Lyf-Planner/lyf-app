import { createContext, useContext, useState } from 'react';
import { TutorialOverlay } from 'pages/tutorial/TutorialOverlay';
import { useAuth } from 'providers/cloud/useAuth';
import { LyfElement } from 'utils/abstractTypes';

type Props = {
  children: LyfElement;
}

type TutorialHooks = {
  updateTutorial: (show: boolean) => void;
}

// Component provider
export const TutorialProvider = ({ children }: Props) => {
  console.log('rendeirng tutorial provider');
  
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

const TutorialContext = createContext<TutorialHooks>(undefined as any);

export const useTutorial = () => {
  return useContext(TutorialContext);
};
