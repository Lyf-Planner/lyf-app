import { View, StyleSheet, Text, ScrollView, Image } from 'react-native';
import { LogoutButton } from 'components/auth/LogoutButton';
import { DeleteButton } from 'components/auth/DeleteMeButton';
import { AccountInfo } from './account/AccountInfo';
import { NotificationSettings } from 'pages/profile/notifications/Notifications';
import { SettingDropdown } from 'components/dropdowns/SettingDropdown';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import { black, deepBlueOpacity, primaryGreen, white } from 'utils/colours';
import { PrivacySettings } from './privacy/PrivacySettings';
import { WeatherSettings } from './weather/WeatherSettings';
import { PageBackground } from 'components/general/PageBackground';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { RouteParams } from 'Routes';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const weatherIcon = require('../../../assets/images/weather.webp');

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
                name="Weather Settings"
                icon={
                  <Image source={weatherIcon} style={styles.weatherIcon} resizeMode="contain" />
                }
              >
                <WeatherSettings />
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
  main: {
    flex: 1,
    minHeight: 500,
    paddingBottom: 100
  },
  scrollContainer: {
    flexDirection: "column",
    width: '100%',
    marginBottom: 200,
  },

  header: {
    zIndex: 50,
    flexDirection: 'row',
    gap: 12,
    alignItems: 'center',
    height: 65,
    paddingHorizontal: 16,

    backgroundColor: primaryGreen, 
    shadowColor: 'black',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 2
  },
  pageTitle: { 
    fontSize: 22, 
    color: white, 
    fontFamily: "Lexend", 
    fontWeight: '400',
   },
  newNoteContainer: { 
    marginLeft: 'auto', 
    marginRight: 5,
  },
  headerSeperator: { borderWidth: 2, opacity: 0.6, marginHorizontal: 14 },

  mainColumn: { 
    flexDirection: 'column', 
    flex: 1,
    width: '100%'
  },
  buttons: {
    alignSelf: 'center',
    maxWidth: 400,
    width: '100%',
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
    paddingVertical: 8,
  },
  weatherIcon: {
    width: 30,
    height: 30,
    tintColor: black,

    position: 'relative',
    right: 5,
  },

  content: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: deepBlueOpacity(0.7)
  }
});
