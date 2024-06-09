import { createContext, useContext, useState } from 'react';
import { IntroSlider } from '../pages/tutorial/IntroSlider';
import { useAuth } from '../authorisation/AuthProvider';

type Props = {
  children: JSX.Element;
}

// Component provider
export const TutorialProvider = ({ children }: Props) => {
  const { initiated } = useAuth();
  const [tutorial, updateTutorial] = useState<any>(!initiated);

  const EXPOSED = {
    updateTutorial
  };

  return (
    <TutorialContext.Provider value={EXPOSED}>
      {tutorial ? <IntroSlider /> : children}
    </TutorialContext.Provider>
  );
};

const TutorialContext = createContext(null);

export const useTutorial = () => {
  return useContext(TutorialContext);
};
