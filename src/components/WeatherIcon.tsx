import BrokenClouds from 'assets/icons/BrokenClouds';
import FewCloudsDay from 'assets/icons/FewCloudsDay';
import FewCloudsNight from 'assets/icons/FewCloudsNight';
import Humidity from 'assets/icons/Humidity';
import LightRainDay from 'assets/icons/LightRainDay';
import LightRainNight from 'assets/icons/LightRainNight';
import Mist from 'assets/icons/Mist';
import Rain from 'assets/icons/Rain';
import ScatteredClouds from 'assets/icons/ScatteredClouds';
import Snow from 'assets/icons/Snow';
import Sunny from 'assets/icons/Sunny';
import Temperature from 'assets/icons/Temperature';
import Thunderstorm from 'assets/icons/Thunderstorm';
import Wind from 'assets/icons/Wind';
import { black } from 'utils/colours';

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
  size?: number,
  color?: string
}

export default function WeatherIcon({ main, description, timestamp, sunrise, sunset, size = 30, color = black }: Props) {
  const dayTime =
    !(timestamp && sunrise && sunset) ||
    !(timestamp < sunrise || timestamp > sunset);

  const { FEELS_LIKE, HUMIDITY, UVI, WIND_SPEED } = OptionalWeatherDataType;
  const { CLEAR, CLOUDS, DRIZZLE, RAIN, SNOW, THUNDERSTORM } = CommonDescription;

  if (atmosphereDescriptions.includes(main)) {
    return <Mist />;
  }

  switch (main) {
    case CLEAR:
      return <Sunny color={color} />
    case CLOUDS:
      switch (description) {
        case 'broken clouds':
          return <BrokenClouds color={color} />
        case 'scattered clouds':
          return <ScatteredClouds color={color} />
        default:
          return dayTime
            ? <FewCloudsDay color={color} />
            : <FewCloudsNight color={color} />;
      }
    case DRIZZLE:
      return dayTime
        ? <LightRainDay color={color} />
        : <LightRainNight color={color} />;
    case FEELS_LIKE:
      return <Temperature color={color} />;
    case HUMIDITY:
      return <Humidity color={color} />;
    case RAIN:
      return <Rain color={color} />;
    case SNOW:
      return <Snow color={color} />;
    case THUNDERSTORM:
      return <Thunderstorm color={color} />;
    case UVI:
      return <Sunny color={color} />;
    case WIND_SPEED:
      return <Wind color={color} />;
    default:
      return <FewCloudsDay color={color} />;
  }
}
