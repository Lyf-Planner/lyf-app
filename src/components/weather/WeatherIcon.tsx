import { Image, StyleSheet } from "react-native";

import BrokenClouds from './icons/BrokenClouds';
import FewCloudsDay from './icons/FewCloudsDay';
import FewCloudsNight from './icons/FewCloudsNight';
import Humidity from './icons/Humidity';
import LightRainDay from './icons/LightRainDay';
import LightRainNight from './icons/LightRainNight';
import Mist from './icons/Mist';
import Rain from './icons/Rain';
import ScatteredClouds from './icons/ScatteredClouds';
import Snow from './icons/Snow';
import Sunny from './icons/Sunny';
import Temperature from './icons/Temperature';
import Thunderstorm from './icons/Thunderstorm';
import Wind from './icons/Wind';

export const atmosphereDescriptions = [
  'Ash',
  'Dust',
  'Fog',
  'Mist',
  'Haze',
  'Sand',
  'Smoke',
  'Squall',
  'Tornado'
];

export enum OptionalWeatherDataType {
  FEELS_LIKE = 'feels_like',
  HUMIDITY = 'humidity',
  UVI = 'uvi',
  WIND_SPEED = 'wind_speed'
}

export enum CommonDescription {
  CLEAR = 'Clear',
  CLOUDS = 'Clouds',
  DRIZZLE = 'Drizzle',
  RAIN = 'Rain',
  SNOW = 'Snow',
  THUNDERSTORM = 'Thunderstorm'
}

type Props = {
  main: string,
  description: string,
  timestamp: Date,
  sunrise: Date,
  sunset: Date,
  size?: number
}

export default function WeatherIcon({ main, description, timestamp, sunrise, sunset, size = 30}: Props) {
  const dayTime =
    !(timestamp && sunrise && sunset) ||
    !(timestamp < sunrise || timestamp > sunset);

  const { FEELS_LIKE, HUMIDITY, UVI, WIND_SPEED } = OptionalWeatherDataType;
  const { CLEAR, CLOUDS, DRIZZLE, RAIN, SNOW, THUNDERSTORM } = CommonDescription;

  const styles = {
    icon: {
      width: size,
      height: size,
    }
  }

  if (atmosphereDescriptions.includes(main)) {
    return <Mist />;
  }

  switch (main) {
    case CLEAR:
      return <Sunny />
    case CLOUDS:
      switch (description) {
        case 'broken clouds':
          return <BrokenClouds />
        case 'scattered clouds':
          return <ScatteredClouds />
        default:
          return dayTime
            ? <FewCloudsDay />
            : <FewCloudsNight />;
      }
    case DRIZZLE:
      return dayTime
        ? <LightRainDay />
        : <LightRainNight />;
    case FEELS_LIKE:
      return <Temperature />;
    case HUMIDITY:
      return <Humidity />;
    case RAIN:
      return <Rain />;
    case SNOW:
      return <Snow />;
    case THUNDERSTORM:
      return <Thunderstorm />;
    case UVI:
      return <Sunny />;
    case WIND_SPEED:
      return <Wind />;
    default:
      return <FewCloudsDay />;
  }
}
