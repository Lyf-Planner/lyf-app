import { View, StyleSheet } from 'react-native';
import { LogoutButton } from './buttons/LogoutButton';
import { DeleteButton } from './buttons/DeleteMeButton';
import { AccountInfo } from './account/AccountInfo';
import { NotificationSettings } from 'pages/profile/notifications/Notifications';
import { SettingDropdown } from 'components/dropdowns/SettingDropdown';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import AntDesign from 'react-native-vector-icons/AntDesign';

export const Profile = () => {
  return (
    <View style={styles.main}>
      <View style={styles.mainColumn}>
        <SettingDropdown
          name="Account Details"
          icon={<MaterialIcons name="user" size={22} />}
          bgColor={'rgba(0,0,0,0.05)'}
        >
          <AccountInfo />
        </SettingDropdown>
        <SettingDropdown
          name="Notification Settings"
          icon={<MaterialIcons name="notifications-active" size={22} />}
          bgColor={'rgba(0,0,0,0.05)'}
        >
          <NotificationSettings />
        </SettingDropdown>
        <SettingDropdown
          name="Privacy Settings"
          icon={<MaterialIcons name="notifications-active" size={22} />}
          bgColor={'rgba(0,0,0,0.05)'}
        >
          <NotificationSettings />
        </SettingDropdown>
        <SettingDropdown
          name="Danger Zone"
          icon={<AntDesign name="warning" size={20} color='red' />}
          bgColor={'rgba(0,0,0,0.05)'}
        >
          <DeleteButton />
        </SettingDropdown>
      </View>
      <View style={styles.buttons}>
        <LogoutButton />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  main: {
    flexDirection: 'column',
    backgroundColor: '#EEE',
    flex: 1,
    gap: 4,
    minHeight: 500
  },
  mainColumn: { 
    flexDirection: 'column', 
    marginBottom: 8 
  },
  buttons: {
    flexDirection: 'column',
    gap: 8,
    paddingHorizontal: 12,
    overflow: 'visible'
  },
  subtitle: {
    opacity: 0.4,
    fontWeight: '600',
    fontSize: 18
  }
});
