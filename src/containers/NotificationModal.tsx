import { useMemo } from 'react';
import { View, Text, ScrollView, TouchableHighlight, StyleSheet } from 'react-native';

import AntDesign from 'react-native-vector-icons/AntDesign';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import { Horizontal } from '@/components/Horizontal';
import { NotificationBanner } from '@/components/NotificationBanner';
import { useNotifications } from '@/hooks/cloud/useNotifications'
import { useModal } from '@/hooks/overlays/useModal'
import { Notification } from '@/schema/notifications';
import { DateString } from '@/schema/util/dates';
import { black, primaryGreen, white } from '@/utils/colours';
import { formatDateData, localisedFormattedMoment } from '@/utils/dates';

export const NotificationModal = () => {
  const { updateModal } = useModal();
  const { notifications } = useNotifications();

  const notificationsByDay = useMemo(() => {
    const dayGroups: Record<DateString, Notification[]> = {};

    notifications.forEach((notification) => {
      const date = formatDateData(new Date(notification.created));

      if (Array.isArray(dayGroups[date])) {
        dayGroups[date].push(notification);
      } else {
        dayGroups[date] = [notification];
      }
    })

    return dayGroups;
  }, [notifications])

  return (
    <View style={styles.main}>
      <View style={styles.mainInternal}>
        <View style={styles.header}>
          <MaterialCommunityIcons name="bell" size={30} color="white" />
          <Text style={styles.title}>Notifications</Text>
          <TouchableHighlight
            style={styles.closeButton}
            onPress={() => updateModal(undefined)}
            underlayColor={'rgba(0,0,0,0.5)'}
          >
            <AntDesign name="close" color="white" size={18} />
          </TouchableHighlight>
        </View>

        <ScrollView contentContainerStyle={styles.scrollWrapper}>
          {notifications.length === 0 &&
            <Text style={styles.upToDateText}>No notifications yet :)</Text>
          }

          {Object.entries(
            notificationsByDay
          ).sort(([dateA, _notifsA], [dateB, _notifsB]) =>
            dateB.localeCompare(dateA)
          ).map(([date, notifications]) => (
            <View style={styles.notificationBlock} key={date}>
              <Text style={styles.notificationDate}>
                {localisedFormattedMoment(date).format('MMM D YYYY')}
              </Text>
              <Horizontal style={styles.notificationSeperator} />
              {notifications.map((x) => (
                <NotificationBanner notification={x} key={x.id} />
              ))}
            </View>
          ))}

        </ScrollView>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  closeButton: {
    borderRadius: 8,
    marginLeft: 'auto',
    padding: 4
  },
  header: {
    alignItems: 'center',
    backgroundColor: primaryGreen,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    flexDirection: 'row',
    gap: 8,
    justifyContent: 'flex-start',
    padding: 15,

    shadowColor: black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    zIndex: 5
  },
  main: {
    position: 'absolute',

    shadowColor: black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 10,
    width: 350
  },
  mainInternal: {
    backgroundColor: white,
    borderColor: white,
    borderRadius: 10,
    borderWidth: 3,
    flexDirection: 'column',
    gap: 8,
    maxHeight: 400,
    overflow: 'hidden'
  },
  notificationBlock: {
    flexDirection: 'column',
    gap: 8
  },
  notificationDate: {
    fontFamily: 'Lexend',
    fontSize: 18
  },
  notificationSeperator: { borderWidth: 1, opacity: 0.7 },
  scrollWrapper: {
    flexDirection: 'column',
    gap: 10,
    paddingHorizontal: 10,
    paddingVertical: 10
  },
  title: {
    color: white,
    fontFamily: 'Lexend',
    fontSize: 22
  },
  upToDateText: {
    alignSelf: 'center',
    fontFamily: 'Lexend',
    fontSize: 18,
    marginBottom: 16,
    marginTop: 8,
    opacity: 0.5
  }
})
