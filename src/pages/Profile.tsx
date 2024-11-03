import { View, StyleSheet, Text, ScrollView, Image } from 'react-native';

import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { RouteParams } from 'Routes';
import { DayFinishingSetting } from 'components/DayFinishingSetting';
import { DeleteButton } from 'components/DeleteMeButton';
import { LogoutButton } from 'components/LogoutButton';
import { NotificationSettings } from 'components/NotificationSetting';
import { PrivacySettings } from 'components/PrivacySettings';
import { WeatherSetting } from 'components/WeatherSetting';
import { AccountInfo } from 'components/profile/AccountInfo';
import { PageBackground } from 'containers/PageBackground';
import { SettingDropdown } from 'containers/SettingDropdown';
import AntDesign from 'react-native-vector-icons/AntDesign';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { black, deepBlueOpacity, primaryGreen, white } from 'utils/colours';

export const Profile = (props: BottomTabScreenProps<RouteParams>) => {
  return (
    <View style={{ flex: 1 }}>
      <View style={styles.header}>
        <FontAwesome5 name="user-alt" size={20} color="white" />
        <Text style={styles.pageTitle}>Account Details</Text>
      </View>
      <PageBackground noPadding>
        <ScrollView style={styles.main}>
          <View style={styles.scrollContainer}>
            <View style={styles.mainColumn}>
              <View style={styles.content}>
                <AccountInfo />
              </View>

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
                name="Calendar Settings"
                icon={<MaterialCommunityIcons name='calendar' size={22} />}
              >
                <WeatherSetting />
                <DayFinishingSetting />
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
          </View>
        </ScrollView>
      </PageBackground>
    </View>
  );
};

const styles = StyleSheet.create({
  buttons: {
    alignSelf: 'center',
    flexDirection: 'column',
    gap: 8,
    marginBottom: 150,
    marginTop: 16,
    maxWidth: 400,
    overflow: 'visible',
    paddingHorizontal: 16,
    width: '100%'
  },
  content: {
    backgroundColor: deepBlueOpacity(0.7),
    paddingHorizontal: 12,
    paddingVertical: 8
  },

  deleteWrapper: {
    paddingHorizontal: 4,
    paddingVertical: 8
  },
  header: {
    alignItems: 'center',
    backgroundColor: primaryGreen,
    flexDirection: 'row',
    gap: 12,
    height: 60,
    paddingHorizontal: 16,

    shadowColor: 'black',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 2,
    zIndex: 50
  },
  headerSeperator: { borderWidth: 2, marginHorizontal: 14, opacity: 0.6 },
  main: {
    flex: 1,
    minHeight: 500,
    paddingBottom: 100
  },

  mainColumn: {
    flexDirection: 'column',
    flex: 1,
    width: '100%'
  },
  newNoteContainer: {
    marginLeft: 'auto',
    marginRight: 5
  },
  pageTitle: {
    color: white,
    fontFamily: 'Lexend',
    fontSize: 22,
    fontWeight: '400'
  },
  scrollContainer: {
    flexDirection: 'column',
    marginBottom: 200,
    width: '100%'
  },
  subtitle: {
    fontSize: 18,
    fontWeight: '600',
    opacity: 0.4
  },

  weatherIcon: {
    height: 30,
    position: 'relative',
    right: 5,

    tintColor: black,
    width: 30
  }
});
