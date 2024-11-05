import { StyleSheet, View, Text } from 'react-native';

import { DailyWeather, HistoricalWeather } from 'openweather-api-node';

import Sunny from '@/assets/icons/Sunny';
import WeatherIcon from '@/components/WeatherIcon';
import { MenuPopoverPlacement } from '@/containers/LyfMenu'
import { LyfPopup } from '@/containers/LyfPopup';
import { useTimetable } from '@/hooks/cloud/useTimetable';
import { DateString } from '@/schema/util/dates';
import { renderDescription } from '@/schema/util/weather';
import { black } from '@/utils/colours';
import { formatDateData } from '@/utils/dates';

type Props = {
  date: DateString;
}

export const WeatherWidget = ({ date }: Props) => {
  const { weather } = useTimetable();
  if (!weather) {
    return (
      <View style={[styles.iconPressableWrapper, styles.loadingIcon]}>
        <Sunny color={black} />
      </View>
    )
  }

  const dateWeather = weather.find((x) => formatDateData(x.dt) === date);
  if (!dateWeather) {
    return null;
  }

  const { weather: { main, description }, astronomical: { sunrise, sunset } } = dateWeather;

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
          color={black}
        />
      </View>
    </LyfPopup>
  )
}

const styles = StyleSheet.create({
  iconPressableWrapper: {
    height: 40,
    padding: 4,
    width: 40
  },
  infoText: {
    fontSize: 14,
    fontWeight: '600',
    opacity: 0.5,
    textAlign: 'center'
  },
  loadingIcon: {
    opacity: 0.4
  },
  mainDesc: {
    fontFamily: 'Lexend',
    fontSize: 16,
    fontWeight: '600'
  },
  popupIconWrapper: {
    height: 70,
    padding: 8,
    width: 70
  },
  popupWrapper: {
    alignItems: 'center',
    flexDirection: 'column',
    padding: 8,
    width: 150
  },

  weatherInfoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: 110
  }
})
