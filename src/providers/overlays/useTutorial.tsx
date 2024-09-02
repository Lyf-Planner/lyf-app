import { createContext, useContext, useState } from 'react';
import { TutorialOverlay } from 'pages/tutorial/TutorialOverlay';
import { useAuth } from 'providers/cloud/useAuth';
import { LyfElement } from 'utils/abstractTypes';
import { RouteParams } from 'Routes';

type Props = {
  children: LyfElement;
}

type TutorialHooks = {
  tutorialRoute: keyof RouteParams;
  updateTutorial: (show: boolean) => void;
  updateTutorialRoute: (route: keyof RouteParams) => void;
}

// Component provider
export const TutorialProvider = ({ children }: Props) => {  
  const [tutorial, updateTutorial] = useState(false);
  const [tutorialRoute, updateTutorialRoute] = useState<keyof RouteParams>('Lyf');

  const exposed = {
    tutorialRoute,
    updateTutorial,
    updateTutorialRoute
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
