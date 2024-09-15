import { LyfMenu, MenuPopoverPlacement } from "components/menus/LyfMenu"
import { LyfPopup } from "components/menus/LyfPopup";
import { DailyWeather, HistoricalWeather } from "openweather-api-node";
import { useTimetable } from "providers/cloud/useTimetable";
import { Image, StyleSheet, View, Text } from 'react-native';
import { DateString } from "schema/util/dates";
import { formatDateData } from "utils/dates";
import { renderDescription } from "schema/util/weather";
import WeatherIcon from "./WeatherIcon";
import Sunny from './icons/Sunny';
import { black } from "utils/colours";

type Props = {
  date: DateString;
}

export const WeatherWidget = ({ date }: Props) => {
  const { weather } = useTimetable();
  if (!weather) {
    return (
      <View style={[styles.iconPressableWrapper, styles.loadingIcon]}>
        <Sunny />
      </View>
    )
  }

  const dateWeather = weather.find((x) => formatDateData(x.dt) === date);
  if (!dateWeather) return null;

  const { weather: { main, description }, astronomical: { sunrise, sunset }} = dateWeather;

  const isHistorical = (data: DailyWeather | HistoricalWeather): data is HistoricalWeather => {
    return Object.keys(data.weather.temp).includes('cur');
  }

  const renderInfo = (label: string, value: number, unit: string) => {
    return (
      <View style={styles.weatherInfoRow}>
        <Text style={styles.infoText}>{label}</Text>
        <Text style={styles.infoText}>{value}{unit}</Text>
      </View>
    )
  }

  const conditionalStyles = {
    iconPressableWrapper: {
      opacity: new Date(date) > new Date() ? 0.5 : 1
    }
  }

  if (date === '2024-09-15') {
    console.log("weather", dateWeather);
  }

  return (
    <LyfPopup 
      name={`weather-${date}`} 
      placement={MenuPopoverPlacement.Top} 
      popupContent={(
        <View style={styles.popupWrapper}>
          <Text style={styles.mainDesc}>{renderDescription(dateWeather.weather.main)}</Text>
          <View style={styles.popupIconWrapper}>
            <WeatherIcon 
              main={main} 
              description={main} 
              timestamp={new Date()} 
              sunrise={sunrise} 
              sunset={sunset} 
              size={50}
            />
          </View>
          <View>
            {isHistorical(dateWeather) ? (
              renderInfo('Temp', Math.round(dateWeather.weather.temp.cur), '°C')
            ) : (
              <>
                {renderInfo('Max', Math.round(dateWeather.weather.temp.max), '°C')}
                {renderInfo('Min', Math.round(dateWeather.weather.temp.min), '°C')}
              </>
            )}
            {renderInfo('Wind', Math.round(dateWeather.weather.wind.gust || dateWeather.weather.wind.speed), ' kmh')}
            {renderInfo('Rain', parseFloat(dateWeather.weather.rain.toFixed(1)), ' mm')}
          </View>
        </View>
      )}
    >
      <View style={[styles.iconPressableWrapper, conditionalStyles.iconPressableWrapper]}>
        <WeatherIcon 
          main={main} 
          description={main} 
          timestamp={new Date()} 
          sunrise={sunrise} 
          sunset={sunset} 
          size={30}
        />
      </View>
    </LyfPopup>
  )
}

const styles = StyleSheet.create({
  iconPressableWrapper: {
    padding: 4,
    width: 40,
    height: 40,
    tintColor: black
  },
  loadingIcon: {
    opacity: 0.4
  },
  popupWrapper: { 
    padding: 8,
    width: 150,
    flexDirection: 'column',
    alignItems: 'center',
  },
  mainDesc: {
    fontFamily: 'Lexend',
    fontWeight: '600',
    fontSize: 16,
  },
  popupIcon: {
    width: 60,
    height: 60,

    shadowOffset: { width: 0, height: 0 },
    shadowColor: 'black',
    shadowOpacity: 1,
    shadowRadius: 1
  },
  weatherInfoRow: {
    flexDirection: 'row',
    width: 110,
    justifyContent: 'space-between',
  },
  infoText: {
    textAlign: 'center',
    opacity: 0.5,
    fontWeight: '600',
    fontSize: 14
  },

  popupIconWrapper: {
    padding: 8,
    width: 70,
    height: 70
  }
})