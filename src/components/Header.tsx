import * as Native from 'react-native'
import { Image, StyleSheet } from "react-native";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { gentleBlack, primaryGreen, white } from "utils/colours";
import { BottomTabNavigationOptions } from "@react-navigation/bottom-tabs";
import { useTutorial } from 'hooks/overlays/useTutorial';
import { useNotifications } from 'hooks/cloud/useNotifications';
import { useModal } from 'hooks/overlays/useModal';
import { NotificationModal } from 'containers/NotificationModal';
import { LyfIcon } from 'assets/icons/LyfIcon';

// This is a little different to other components.
// What we're doing here is writing a function which provides an argument to the BottomTabNavigator header param
// If using their API becomes impractical this can be replaced with a custom component

export function defaultTabHeader(label: string): BottomTabNavigationOptions  {
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
    tabBarHideOnKeyboard: true,
  };
}

const styles = StyleSheet.create({
  header: {
    borderBottomColor: gentleBlack,
    backgroundColor: white,
    height:  Native.Platform.OS !== 'ios' ? 60 : 100
  },
  titleContent: {
    flexDirection: "row",
    justifyContent: "flex-start",
    gap: 10,
    paddingBottom: Native.Platform.OS === 'web' ? 0 : 4,
    alignItems: "center",
  },
  tutorialButton: {
    flexDirection: "row",
    justifyContent: "flex-start",
    gap: 10,
    marginLeft: 20,
    paddingBottom: 4,
    alignItems: "center",
  },
  settingsButton: {
    flexDirection: "row",
    justifyContent: "flex-start",
    gap: 10,
    marginRight: 20,
    paddingBottom: 4,
    alignItems: "center",
  },
  title: {
    color: primaryGreen,
    fontFamily: "Lexend",
    fontWeight: '600',
    fontSize: 28,
    textAlign: "center",
  },
  back: {
    marginLeft: 20,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    padding: 1,
  },
  icon: { 
    height: 40,
    width: 30,
  },
  notifications: {
  },
  notificationTally: { 
    position: 'absolute', 
    justifyContent: 'center', 
    flexDirection: 'row', 
    alignItems: 'center', 
    borderRadius: 10, 
    backgroundColor: 'red',
    width: 20,
    height: 20,
    right: -6,
    top: -8,
    borderWidth: 1,
    borderColor: 'white'
  },
  notificationTallyText: {
    color: 'white', 
    fontFamily: 'Lexend'
  }
});
