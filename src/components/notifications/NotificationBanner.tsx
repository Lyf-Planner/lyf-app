import * as Native from 'react-native';
import { BouncyPressable } from "components/pressables/BouncyPressable";
import { Notification } from "schema/notifications"
import { NotificationRelatedData, NotificationType } from 'schema/database/notifications';
import Feather from 'react-native-vector-icons/Feather';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Entypo from 'react-native-vector-icons/Entypo';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import { deepBlueOpacity, eventsBadgeColor, eventsBadgeColorOpacity } from 'utils/colours';
import { useNotifications } from 'hooks/cloud/useNotifications';
import { useNavigation } from '@react-navigation/native';
import { ItemDrawer } from 'components/item/ItemDrawer';
import { useDrawer } from 'hooks/overlays/useDrawer';
import { RouteParams } from 'Routes';
import { useModal } from 'hooks/overlays/useModal';
import { UserModal } from 'components/users/UserModal';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';

const notificationTypeIcon: Record<NotificationType, JSX.Element> = Object.freeze({
  'ItemReminder': <Feather name="clock" size={24} />,
  'ItemSocial': <MaterialCommunityIcons name='calendar' size={28} />,
  'NoteSocial': <Entypo name='list' size={30} />,
  'UserSocial': <FontAwesome5 name="user-friends" size={22} />,
})

type Props = {
  notification: Notification;
}

export const NotificationBanner = ({ notification }: Props) => {
  const { readNotification } = useNotifications();
  const { updateDrawer } = useDrawer();
  const { updateModal } = useModal();
  const navigation = useNavigation<BottomTabNavigationProp<RouteParams>>();

  const actionNotification = () => {
    readNotification(notification.id);

    switch (notification.related_data) {
      case NotificationRelatedData.User:
        navigation.navigate('Friends');
        updateDrawer(undefined);
        if (notification.related_id) {
          updateModal(
            <UserModal user_id={notification.related_id} />
          );
        }
        break;
      case NotificationRelatedData.Item:
        navigation.navigate('Timetable');
        updateModal(undefined);
        if (notification.related_id) {
          updateDrawer(
            <ItemDrawer id={notification.related_id} />
          );
        }
        break;
      case NotificationRelatedData.Note:
        navigation.navigate('Notes', { id: notification.related_id });
        break;
      default:
        null;
    }
  }

  const conditionalStyles = {
    pressable: notification.seen ? {
      opacity: 0.6,
    } : {
      shadowColor: 'black',
      shadowOpacity: 0.5,
      shadowRadius: 2,
      shadowOffset: { 
        width: 1, 
        height: 1
      }
    }
  }

  return (
    <BouncyPressable 
      onPress={() => actionNotification()} 
      style={[conditionalStyles.pressable, styles.pressable]}
    >
      <Native.View style={styles.main}>
        <Native.View style={styles.icon}>{notificationTypeIcon[notification.type]}</Native.View>

        <Native.View style={styles.content}>
          <Native.Text style={styles.title}>{notification.title}</Native.Text>
          {notification.message && 
              <Native.Text style={styles.body}>{notification.message}</Native.Text>
          }
        </Native.View>
      </Native.View>
    </BouncyPressable>
  )
}

const styles = Native.StyleSheet.create({
  pressable: {
    borderRadius: 10
  },
  main: { 
    flexDirection: 'row', 
    alignItems: 'center',
    gap: 10,
    padding: 10,
    borderRadius: 10,
    overflow: 'hidden',
    backgroundColor: eventsBadgeColorOpacity(0.9),

    borderWidth: 1,
    borderColor: deepBlueOpacity(0.2)
  },
  icon: {
    width: 35,
    height: 35,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center'
  },
  content: {
    height: 'auto'
  },
  title: {
    fontFamily: 'Lexend',
    fontSize: 18,
  },

  body: {
    opacity: 0.6,
    fontSize: 14,
    flexWrap: 'wrap',
    width: 240,
  },

  unread: {
    marginVertical: 'auto',
    width: 30
  }
})