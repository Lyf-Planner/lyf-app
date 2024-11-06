import { create } from 'zustand';

type LocationState = {
  latitude: number | null;
  longitude: number | null;
  setLocation: (latitude: number, longitude: number) => void;
};

export const useLocationStore = create<LocationState>((set) => ({
  latitude: null,
  longitude: null,
  setLocation: (latitude, longitude) => set({ latitude, longitude })
}));
