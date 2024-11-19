import { StyleSheet, View, Text, Switch, Platform } from 'react-native'

import { useAuthStore } from '@/store/useAuthStore';
import { white } from '@/utils/colours';

export const PrivacySettings = () => {
  const { user, updateUser } = useAuthStore();

  const updatePrivate = (enabled: boolean) => updateUser({ private: enabled })

  return (
    <View style={styles.main}>
      {Platform.OS === 'web' ? (
        <View style={styles.privacySettingRow}>
          <Switch
            onValueChange={updatePrivate}
            value={user?.private}
            ios_backgroundColor={'gray'}
          />
          <Text style={styles.privateModeText}>Private Mode</Text>
        </View>
      ) : (
        <View style={styles.privacySettingRow}>
          <Text style={styles.privateModeText}>Private Mode</Text>
          <Switch
            style={styles.privacyModeToggle}
            onValueChange={updatePrivate}
            value={user?.private}
            ios_backgroundColor={'gray'}
          />
        </View>
      )}

      <Text style={styles.hint}>Private Mode makes you undiscoverable to all users</Text>
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
  privacyModeToggle: {
    marginLeft: 'auto'
  },
  privacySettingRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 8
  },
  privateModeText: {
    color: white,
    fontFamily: 'Lexend',
    fontSize: 20
  }
})
