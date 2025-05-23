import { StyleSheet, View, Text, Switch, Platform } from 'react-native'

import { useLocation } from '@/shell/useLocation';
import { useAuthStore } from '@/store/useAuthStore';
import { white } from '@/utils/colours';

export const WeatherSetting = () => {
  const { user, updateUser } = useAuthStore();
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
      {Platform.OS === 'web' ? (
        <View style={styles.settingRow}>
          <Switch
            onValueChange={updateWeather}
            value={!!user?.weather_data}
            ios_backgroundColor={'gray'}
          />
          <Text style={styles.settingNameText}>Enable Weather Data</Text>
        </View>
      ) : (
        <View style={styles.settingRow}>
          <Text style={styles.settingNameText}>Enable Weather Data</Text>
          <Switch
            style={styles.settingToggle}
            onValueChange={updateWeather}
            value={!!user?.weather_data}
            ios_backgroundColor={'gray'}
          />
        </View>
      )}

      <Text style={styles.hint}>This requires your geolocation data. Lyf will never store any of this information.</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  hint: {
    color: white,
    fontSize: 16,
    opacity: 0.6
  },
  main: {
    flexDirection: 'column',
    gap: 8,
    paddingHorizontal: 8,
    paddingVertical: 14
  },
  settingNameText: {
    color: white,
    fontFamily: 'Lexend',
    fontSize: 20
  },
  settingRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 8
  },
  settingToggle: {
    marginLeft: 'auto'
  }
})
