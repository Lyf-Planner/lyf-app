import { LyfMenu, MenuPopoverPlacement } from "components/menus/LyfMenu"
import { LyfPopup } from "components/menus/LyfPopup";
import { DailyWeather, HistoricalWeather } from "openweather-api-node";
import { useTimetable } from "providers/cloud/useTimetable";
import { Image, StyleSheet, View, Text } from 'react-native';
import { DateString } from "schema/util/dates";
import { sun } from "utils/colours";
import { formatDateData } from "utils/dates";
import { renderDescription } from "schema/util/weather";

type Props = {
  date: DateString;
}

export const WeatherWidget = ({ date }: Props) => {
  const { weather } = useTimetable();
  const dateWeather = weather.find((x) => formatDateData(x.dt) === date);

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

  if (!dateWeather) return null;

  const conditionalStyles = {
    iconPressable: {
      opacity: new Date(date) < new Date() ? 1 : 0.75,
    }
  }

  if (isHistorical(dateWeather)) {
    console.log(dateWeather);
  }

  return (
    <LyfPopup 
      name={`weather-${date}`} 
      placement={MenuPopoverPlacement.Top} 
      popupContent={(
        <View style={styles.popupWrapper}>
          <Text style={styles.mainDesc}>{renderDescription(dateWeather.weather.main)}</Text>
          <Image src={dateWeather.weather.icon.url} style={styles.popupIcon} resizeMode="contain" />
          <View>
            {isHistorical(dateWeather) ? (
              renderInfo('Temp', Math.round(dateWeather.weather.temp.cur), '°C')
            ) : (
              <>
                {renderInfo('Max', Math.round(dateWeather.weather.temp.max), '°C')}
                {renderInfo('Min', Math.round(dateWeather.weather.temp.min), '°C')}
              </>
            )}
            {renderInfo('Wind', Math.round(dateWeather.weather.wind.speed), ' kmh')}
            {renderInfo('Rain', Math.round(dateWeather.weather.rain), ' mm')}
          </View>
        </View>
      )}
    >
      <Image 
        src={dateWeather.weather.icon.url} 
        style={[styles.iconPressable, conditionalStyles.iconPressable]} 
        resizeMode="contain" 
      />
    </LyfPopup>
  )
}

const styles = StyleSheet.create({
  iconPressable: {
    width: 40,
    height: 40,

    shadowOffset: { width: 0, height: 0 },
    shadowColor: 'black',
    shadowOpacity: 1,
    shadowRadius: 1
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
})