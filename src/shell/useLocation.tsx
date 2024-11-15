import { createContext, useContext, useEffect, useState } from 'react';
import { Platform } from 'react-native';

import {
  requestForegroundPermissionsAsync,
  getLastKnownPositionAsync,
  LocationObject,
  getCurrentPositionAsync
} from 'expo-location';
import { DailyWeather, HistoricalWeather } from 'openweather-api-node';

import { getWeather } from '@/rest/items';
import { useAuthStore } from '@/store/useAuthStore';
import { useTimetableStore } from '@/store/useTimetableStore';

type Props = {
  children: JSX.Element;
}

type LocationHooks = {
  location?: LocationObject;
  weather: (DailyWeather | HistoricalWeather)[] | null,
  requestLocation: () => Promise<boolean>;
}

export const LocationProvider = ({ children }: Props) => {
  const [location, setLocation] = useState<LocationObject | undefined>(undefined);
  const [weather, setWeather] = useState<(HistoricalWeather | DailyWeather)[] | null>(null);

  const { user } = useAuthStore();
  const { startDate, endDate } = useTimetableStore();

  // Request user location permission
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

  // Reset weather when location or dates change
  useEffect(() => {
    if (location && user && user.weather_data) {
      getWeather(startDate, endDate, location).then((data) => {
        setWeather(data)
      })
    }
  }, [startDate, endDate, location])

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
    weather,
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
