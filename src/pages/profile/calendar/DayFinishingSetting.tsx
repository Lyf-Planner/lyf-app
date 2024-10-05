import { useAuth } from "providers/cloud/useAuth"
import { StyleSheet, View, Text, Switch } from "react-native"

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