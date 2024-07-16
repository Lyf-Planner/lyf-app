import { View, StyleSheet, Text, ScrollView } from 'react-native';
import { LogoutButton } from 'components/auth/LogoutButton';
import { DeleteButton } from 'components/auth/DeleteMeButton';
import { AccountInfo } from './account/AccountInfo';
import { NotificationSettings } from 'pages/profile/notifications/Notifications';
import { SettingDropdown } from 'components/dropdowns/SettingDropdown';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import { primaryGreen } from 'utils/colours';
import { PrivacySettings } from './privacy/PrivacySettings';

export const Profile = () => {
  return (
    <ScrollView style={styles.main}>
      <View style={styles.mainColumn}>
        <SettingDropdown
          name="Account Details"
          icon={<FontAwesome5 name="user-alt" size={20} color='white' />}
          bgColor={primaryGreen}
          textColor='white'
          startOpen
        >
          <AccountInfo />
        </SettingDropdown>
        <SettingDropdown
          name="Notification Settings"
          icon={<MaterialIcons name="notifications-active" size={22} />}
        >
          <NotificationSettings />
        </SettingDropdown>
        <SettingDropdown
          name="Privacy Settings"
          icon={<FontAwesome5 name="lock" size={20} />}
        >
          <PrivacySettings />
        </SettingDropdown>
        <SettingDropdown
          name="Danger Zone"
          icon={<AntDesign name="warning" size={20} />}
        >
          <View style={styles.deleteWrapper}>
            <DeleteButton />
          </View>
        </SettingDropdown>
      </View>
      <View style={styles.buttons}>
        <LogoutButton />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  main: {
    backgroundColor: '#EEE',
    flex: 1,
    minHeight: 500,
  },
  mainColumn: { 
    flexDirection: 'column', 
  },
  buttons: {
    flexDirection: 'column',
    gap: 8,
    paddingHorizontal: 16,
    overflow: 'visible',
    marginBottom: 150,
    marginTop: 16,
  },
  subtitle: {
    opacity: 0.4,
    fontWeight: '600',
    fontSize: 18
  },
  deleteWrapper: {
    paddingHorizontal: 4,
    paddingTop: 16,
  }
});
