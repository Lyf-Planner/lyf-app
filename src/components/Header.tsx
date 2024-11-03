import * as Native from 'react-native'
import { Image, StyleSheet } from 'react-native';

import { BottomTabNavigationOptions } from '@react-navigation/bottom-tabs';
import { LyfIcon } from 'assets/icons/LyfIcon';
import { NotificationModal } from 'containers/NotificationModal';
import { useNotifications } from 'hooks/cloud/useNotifications';
import { useModal } from 'hooks/overlays/useModal';
import { useTutorial } from 'hooks/overlays/useTutorial';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { gentleBlack, primaryGreen, white } from 'utils/colours';

// This is a little different to other components.
// What we're doing here is writing a function which provides an argument to the BottomTabNavigator header param
// If using their API becomes impractical this can be replaced with a custom component

export function defaultTabHeader(label: string): BottomTabNavigationOptions {
  const { updateTutorial } = useTutorial();
  const { notifications } = useNotifications();
  const { updateModal } = useModal();

  return {
    headerShown: true,
    headerStyle: styles.header,
    headerTitle: () => (
      <Native.View style={styles.titleContent}>
        <Native.Text style={styles.title}>{label}</Native.Text>
      </Native.View>
    ),
    headerLeft: () => (
      <Native.TouchableOpacity
        style={styles.tutorialButton}
        onPress={() => updateTutorial(true)}
      >
        <LyfIcon size={28} />
      </Native.TouchableOpacity>
    ),
    headerRight: () => (
      <Native.TouchableOpacity
        style={styles.settingsButton}
        onPress={() => updateModal(<NotificationModal />)}
      >
        <MaterialCommunityIcons name="bell" style={styles.notifications} size={30} />
        {notifications.filter((x) => !x.seen).length > 0 &&
        <Native.View style={styles.notificationTally}>
          <Native.Text style={styles.notificationTallyText}>
            {notifications.filter((x) => !x.seen).length}
          </Native.Text>
        </Native.View>
        }
      </Native.TouchableOpacity>
    ),
    headerTitleStyle: styles.title,
    tabBarHideOnKeyboard: true
  };
}

const styles = StyleSheet.create({
  back: {
    alignItems: 'center',
    borderRadius: 20,
    flexDirection: 'row',
    justifyContent: 'center',
    marginLeft: 20,
    padding: 1
  },
  header: {
    backgroundColor: white,
    borderBottomColor: gentleBlack,
    height: Native.Platform.OS !== 'ios' ? 60 : 100
  },
  icon: {
    height: 40,
    width: 30
  },
  notificationTally: {
    alignItems: 'center',
    backgroundColor: 'red',
    borderColor: 'white',
    borderRadius: 10,
    borderWidth: 1,
    flexDirection: 'row',
    height: 20,
    justifyContent: 'center',
    position: 'absolute',
    right: -6,
    top: -8,
    width: 20
  },
  notificationTallyText: {
    color: 'white',
    fontFamily: 'Lexend'
  },
  notifications: {
  },
  settingsButton: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 10,
    justifyContent: 'flex-start',
    marginRight: 20,
    paddingBottom: 4
  },
  title: {
    color: primaryGreen,
    fontFamily: 'Lexend',
    fontSize: 28,
    fontWeight: '600',
    textAlign: 'center'
  },
  titleContent: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 10,
    justifyContent: 'flex-start',
    paddingBottom: Native.Platform.OS === 'web' ? 0 : 4
  },
  tutorialButton: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 10,
    justifyContent: 'flex-start',
    marginLeft: 20,
    paddingBottom: 4
  }
});
