import { useAuth } from "providers/cloud/useAuth"
import { useLocation } from "providers/cloud/useLocation";
import { StyleSheet, View, Text, Switch } from "react-native"

export const WeatherSettings = () => {
  const { user, updateUser } = useAuth();
  const { requestLocation } = useLocation();

  const updateWeather = (enabled?: boolean) => {
    if (enabled) {
      requestLocation();
      return;
    }

    updateUser({ weather_data: false })
  }

  return (
    <View style={styles.main}>
      <View style={styles.privacySettingRow}>
        <Text style={styles.privateModeText}>Enable Weather Data</Text>
        <Switch 
          style={styles.privacyModeToggle} 
          onValueChange={updateWeather}
          value={!!user?.weather_data}
          ios_backgroundColor={'gray'}
        />
      </View>
      <Text style={styles.hint}>This requires your geolocation data. Lyf will never store any of this information.</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  main: {
    paddingVertical: 14,
    paddingHorizontal: 8,
    flexDirection: 'column',
    gap: 8,
  },
  privacySettingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8
  },
  privateModeText: {
    fontFamily: 'Lexend',
    fontSize: 20,
    color: 'white'
  },
  privacyModeToggle: {
    marginLeft: 'auto',
  },
  hint: {
    opacity: 0.6,
    fontSize: 16,
    color: 'white'
  },
})