import { createContext, useContext, useState } from 'react';

export enum DisplayedWidgets {
  Schedule = 'Schedule',
  Lists = 'Lists',
}

export enum AllWidgets {
  Schedule = 'Schedule',
  Lists = 'Lists',
  Account = 'Account',
  Tutorial = 'Tutorial',
}

type Props = {
  children: JSX.Element;
}

// Component provider
export const WidgetProvider = ({ children }: Props) => {
  const [activeWidget, setWidget] = useState<any>(AllWidgets.Schedule);

  const EXPOSED = {
    activeWidget,
    setWidget
  };

  return (
    <WidgetContext.Provider value={EXPOSED}>{children}</WidgetContext.Provider>
  );
};

const WidgetContext = createContext(null);

export const useWidgetNavigator = () => {
  return useContext(WidgetContext);
};
