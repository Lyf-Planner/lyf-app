import { View, StyleSheet, Text } from 'react-native';
import { LogoutButton } from './buttons/LogoutButton';
import { DeleteButton } from './buttons/DeleteMeButton';
import { AccountInfo } from './profile/AccountInfo';
import { NotificationSettings } from './notifications/Notifications';
import { SettingDropdown } from '../../components/dropdowns/SettingDropdown';
import { FindUsers } from './friends/FindUsers';
import { useAuth } from 'providers/cloud/useAuth';
import { FetchUserList } from '../../components/users/UserList';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

export type DropdownOpenInstructor = {
  profile?: boolean;
  friends?: boolean;
  requests?: boolean;
  search?: boolean;
  notifications?: boolean;
};

export const AccountWidget = ({
  logout,
  deleteMe,
  dropdownOpen = {} as DropdownOpenInstructor
}) => {
  const { user } = useAuth();

  return (
    <View style={styles.widgetContainer}>
      <View style={{ flexDirection: 'column', marginBottom: 8 }}>
        <SettingDropdown
          name="My Profile"
          icon={<FontAwesome name="user" size={22} style={{ left: 2 }} />}
          bgColor={'rgba(0,0,0,0.05)'}
          startOpen={dropdownOpen.profile}
        >
          <AccountInfo />
        </SettingDropdown>
        <SettingDropdown
          name={
            <Text>
              My Friends{' '}
              <Text style={styles.subtitle}>
                ({user.social.friends.length})
              </Text>
            </Text>
          }
          icon={<FontAwesome name="users" size={18} />}
          startOpen={dropdownOpen.friends}
        >
          <FetchUserList
            users={user.social.friends}
            emptyText={'Search for friends below :)'}
          />
        </SettingDropdown>
        <SettingDropdown
          startOpen={dropdownOpen.requests}
          name={
            <Text>
              Friend Requests{' '}
              <Text style={styles.subtitle}>
                ({user.social.requests.length})
              </Text>
            </Text>
          }
          icon={<FontAwesome name="plus" size={20} />}
          bgColor={'rgba(0,0,0,0.05)'}
        >
          <FetchUserList
            users={user.social.requests}
            emptyText={'No friend requests at the moment :)'}
          />
        </SettingDropdown>
        <SettingDropdown
          startOpen={dropdownOpen.search}
          name="Find Users"
          icon={<FontAwesome name="search" size={20} />}
        >
          <FindUsers />
        </SettingDropdown>
        <SettingDropdown
          name="Notification Settings"
          startOpen={dropdownOpen.notifications}
          icon={<MaterialIcons name="notifications-active" size={22} />}
          bgColor={'rgba(0,0,0,0.05)'}
        >
          <NotificationSettings />
        </SettingDropdown>
      </View>
      <View style={styles.buttons}>
        <LogoutButton logout={logout} />
        <DeleteButton logout={logout} deleteMe={deleteMe} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  widgetContainer: {
    flexDirection: 'column',
    flex: 1,
    gap: 4,
    paddingHorizontal: 12,
    marginTop: 2,
    minHeight: 500
  },
  buttons: {
    flexDirection: 'column',
    gap: 8,
    marginTop: 'auto'
  },
  subtitle: {
    opacity: 0.4,
    fontWeight: '600',
    fontSize: 18
  }
});
