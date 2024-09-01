import { upcomingColor } from "components/item/constants";
import { useAuth } from "providers/cloud/useAuth"
import { StyleSheet, View, Text, Switch } from "react-native"

export const PrivacySettings = () => {
  const { user, updateUser } = useAuth();

  const updatePrivate = (enabled: boolean) => updateUser({ private: enabled })

  return (
    <View style={styles.main}>
      <View style={styles.privacySettingRow}>
        <Text style={styles.privateModeText}>Private Mode</Text>
        <Switch 
          style={styles.privacyModeToggle} 
          onValueChange={updatePrivate}
          value={user?.private}
          ios_backgroundColor={'gray'}
        />
      </View>
      <Text style={styles.hint}>Private Mode makes you undiscoverable to all users</Text>
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