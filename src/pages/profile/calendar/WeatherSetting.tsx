import { useAuth } from "providers/cloud/useAuth"
import { useLocation } from "hooks/cloud/useLocation";
import { StyleSheet, View, Text, Switch } from "react-native"

export const WeatherSetting = () => {
  const { user, updateUser } = useAuth();
  const { requestLocation } = useLocation();

  const updateWeather = (enabled?: boolean) => {
    if (enabled) {
      requestLocation().then((locationPermitted) => 
        updateUser({ weather_data: locationPermitted })
      );
      return;
    }

    updateUser({ weather_data: false });
  }

  return (
    <View style={styles.main}>
      <View style={styles.settingRow}>
        <Text style={styles.settingNameText}>Enable Weather Data</Text>
        <Switch 
          style={styles.settingToggle} 
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
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8
  },
  settingNameText: {
    fontFamily: 'Lexend',
    fontSize: 20,
    color: 'white'
  },
  settingToggle: {
    marginLeft: 'auto',
  },
  hint: {
    opacity: 0.6,
    fontSize: 16,
    color: 'white'
  },
})