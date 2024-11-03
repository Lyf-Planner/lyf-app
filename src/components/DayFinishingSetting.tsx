import { StyleSheet, View, Text, Switch } from 'react-native'

import { useAuth } from 'hooks/cloud/useAuth'

export const DayFinishingSetting = () => {
  const { user, updateUser } = useAuth();

  const updateDayFinishing = (enabled: boolean) => {
    updateUser({ auto_day_finishing: enabled })
  }

  return (
    <View style={styles.main}>
      <View style={styles.settingRow}>
        <Text style={styles.settingNameText}>Automatic Day Finishing</Text>
        <Switch
          style={styles.settingToggle}
          onValueChange={updateDayFinishing}
          value={!!user?.auto_day_finishing}
          ios_backgroundColor={'gray'}
        />
      </View>
      <Text style={styles.hint}>
        Automatically finish the day when all tasks are done. To do this manually, hold down the day.
      </Text>
    </View>
  )
}

const styles = StyleSheet.create({
  hint: {
    color: 'white',
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
    color: 'white',
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
