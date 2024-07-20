import * as Native from 'react-native';
import { BouncyPressable } from "components/pressables/BouncyPressable";
import { Notification } from "schema/notifications"
import { NotificationType } from 'schema/database/notifications';
import Feather from 'react-native-vector-icons/Feather';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Entypo from 'react-native-vector-icons/Entypo';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import Octicons from 'react-native-vector-icons/Octicons';
import { eventsBadgeColor, primaryGreen } from 'utils/colours';
import { useNotifications } from 'providers/cloud/useNotifications';

const notificationTypeIcon: Record<NotificationType, JSX.Element> = Object.freeze({
  'ItemReminder': <Feather name="clock" />,
  'ItemSocial': <MaterialCommunityIcons name='calendar' size={30} />,
  'NoteSocial': <Entypo name='list' size={30} />,
  'UserSocial': <FontAwesome5 name="user-friends" size={27} />,
})

type Props = {
  notification: Notification;
}

export const NotificationBanner = ({ notification }: Props) => {
  const { readNotification } = useNotifications();

  return (
    <BouncyPressable onPress={() => readNotification(notification.id)}>
      <Native.View style={styles.main}>
        <Native.View>{notificationTypeIcon[notification.type]}</Native.View>

        <Native.View style={styles.content}>
          <Native.Text style={styles.title}>{notification.title}</Native.Text>
          {notification.message && 
         
              <Native.Text style={styles.body}>{notification.message}</Native.Text>

          }
        </Native.View>


        <Octicons
          name="dot-fill"
          color={notification.seen ? 'black' : 'white'}
          style={styles.unread}
        />

      </Native.View>
    </BouncyPressable>
  )
}

const styles = Native.StyleSheet.create({
  main: { 
    flexDirection: 'row', 
    alignItems: 'center',
    gap: 10,
    padding: 10,
    borderRadius: 10,
    overflow: 'hidden',
    backgroundColor: eventsBadgeColor
  },
  content: {
    height: 'auto'
  },
  title: {
    fontFamily: 'Lexend',
    fontSize: 20,
  },

  body: {
    opacity: 0.6,
    fontSize: 16,
    flexWrap: 'wrap',
    width: 240,
  },

  unread: {
    marginVertical: 'auto',
    width: 30
  }

})