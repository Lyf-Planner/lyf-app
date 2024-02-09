import { createContext, useContext, useState } from "react";
import { IntroSlider } from "../widgets/tutorial/IntroSlider";

// Component provider
export const TutorialProvider = ({ children }) => {
  const [tutorial, updateTutorial] = useState<any>(false);

  const EXPOSED = {
    updateTutorial,
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
