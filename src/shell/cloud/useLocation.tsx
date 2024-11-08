import { createContext, useContext, useEffect, useState } from 'react';
import { Platform } from 'react-native';

import {
  requestForegroundPermissionsAsync,
  getLastKnownPositionAsync,
  LocationObject,
  getCurrentPositionAsync
} from 'expo-location';

import { useAuthStore } from '@/store/useAuthStore';

type Props = {
  children: JSX.Element;
}

type LocationHooks = {
  location?: LocationObject;
  requestLocation: () => Promise<boolean>;
}

export const LocationProvider = ({ children }: Props) => {
  const [location, setLocation] = useState<LocationObject | undefined>(undefined);
  const { user } = useAuthStore();

  useEffect(() => {
    (async () => {
      if (user?.weather_data === false) {
        // Don't ask twice
        setLocation(undefined);
        return;
      }

      await requestLocation();
    })();
  }, [user?.weather_data]);

  const requestLocation = async () => {
    const { status } = await requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      return false;
    }

    const retrievedLocation = Platform.OS === 'web' ? await getCurrentPositionAsync() : await getLastKnownPositionAsync({});

    setLocation(retrievedLocation || undefined);
    return true;
  }

  const exposed: LocationHooks = {
    location,
    requestLocation
  };

  return (
    <LocationContext.Provider value={exposed}>
      {children}
    </LocationContext.Provider>
  );
};

const LocationContext = createContext<LocationHooks>(undefined as never);

export const useLocation = () => {
  return useContext(LocationContext);
};
