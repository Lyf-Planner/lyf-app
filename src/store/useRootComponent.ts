import { Platform } from 'react-native';

import { create } from 'zustand';

type RootComponentState = {
  drawer: JSX.Element | null;
  minHeight: number;
  updateDrawer: (drawer: JSX.Element | null) => void;
  updateSheetMinHeight: (minHeight: number) => void;

  modal: JSX.Element | null;
  closeable: boolean;
  updateModal: (modal: JSX.Element | null, closeable?: boolean) => void;
}

export const useRootComponentStore = create<RootComponentState>((set, get) => ({
  // drawer stuff
  drawer: null,
  minHeight: 100,

  updateDrawer: (drawer: JSX.Element | null) => {
    // on web, always use modals in place of drawers
    if (Platform.OS === 'web') {
      set({ modal: drawer });
      return;
    }

    set({ drawer });
  },
  updateSheetMinHeight: (minHeight: number) => {
    set({ minHeight });
  },

  // modal stuff
  modal: null,
  closeable: true,

  updateModal: (modal: JSX.Element | null, closeable: boolean = true) => {
    set({ modal, closeable });
  }
}));

