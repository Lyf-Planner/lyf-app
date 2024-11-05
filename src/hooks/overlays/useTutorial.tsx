import { createContext, useContext, useState } from 'react';

import { RouteParams } from '@/Routes';
import { LyfElement } from '@/utils/abstractTypes';

type Props = {
  children: LyfElement;
}

type TutorialHooks = {
  tutorial: boolean,
  tutorialRoute: keyof RouteParams | undefined;
  updateTutorial: (show: boolean) => void;
  updateTutorialRoute: (route: keyof RouteParams) => void;
}

// Component provider
export const TutorialProvider = ({ children }: Props) => {
  const [tutorial, updateTutorial] = useState(false);
  const [tutorialRoute, updateTutorialRoute] = useState<keyof RouteParams>();

  const exposed = {
    tutorial,
    tutorialRoute,
    updateTutorial,
    updateTutorialRoute
  };

  return (
    <TutorialContext.Provider value={exposed}>
      {children}
    </TutorialContext.Provider>
  );
};

const TutorialContext = createContext<TutorialHooks>(undefined as never);

export const useTutorial = () => {
  return useContext(TutorialContext);
};
