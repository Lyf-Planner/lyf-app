import * as Native from 'react-native';

import { useNotifications } from "providers/cloud/useNotifications"
import { useModal } from "providers/overlays/useModal"
import { primaryGreen, white } from 'utils/colours';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { NotificationBanner } from './NotificationBanner';
import { Horizontal } from 'components/general/MiscComponents';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useMemo } from 'react';
import { DateString } from 'schema/util/dates';



type NotificationBlock = DateString[];
type NotificationBlocks = NotificationBlock[];


export const NotificationModal = () => {
  const { notifications } = useNotifications();
  const notificationsByDay = useMemo(() => {
    const notificationsByDate = notifications.sort((a, b) => (
      new Date(a.created).getTime() - new Date(b.created).getTime()
    ));

      return notificationsByDate
  }, [notifications])
  const { updateModal } = useModal();

  const allSeen = useMemo(() => notifications.every((x) => x.seen), notifications);

  return (
    <Native.View style={styles.main}>
      <Native.View style={styles.mainInternal}>
        <Native.View style={styles.header}>
          <MaterialCommunityIcons name="bell" size={30} color="white" />
          <Native.Text style={styles.title}>Notifications</Native.Text>
          <Native.TouchableHighlight
            style={styles.closeButton}
            onPress={() => updateModal(undefined)}
            underlayColor={'rgba(0,0,0,0.5)'}
          >
            <AntDesign name="close" color="white" size={18} />
          </Native.TouchableHighlight>
        </Native.View>

        <Native.ScrollView contentContainerStyle={styles.scrollWrapper}>
          {allSeen &&
            <Native.Text style={styles.upToDateText}>All up to date :)</Native.Text>
          }
          {notifications.map((x) => (
            <NotificationBanner notification={x} key={x.id} />
          ))}
        </Native.ScrollView>
      </Native.View>
    </Native.View>
  )

}

const styles = Native.StyleSheet.create({
  main: {
    position: 'absolute',
    width: 350,

    shadowColor: 'black',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 10
  },
  mainInternal: {
    maxHeight: 400,
    overflow: 'hidden',
    backgroundColor: white,
    flexDirection: 'column',
    gap: 8,
    borderRadius: 10,
    borderWidth: 3,
    borderColor: 'white',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    gap: 8,
    padding: 15,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    backgroundColor: primaryGreen,
    zIndex: 5,

    shadowColor: 'black',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2
  },
  title: {
    fontFamily: 'Lexend',
    fontSize: 22,
    color: 'white'
  },
  closeButton: {
    marginLeft: 'auto',
    padding: 4,
    borderRadius: 8
  },
  scrollWrapper: {
    flexDirection: 'column',
    gap: 10,
    paddingVertical: 10,
    paddingHorizontal: 10,
  },
  upToDateText: {
    alignSelf: 'center',  
    opacity: 0.6, 
    fontFamily: 'Lexend',
    marginBottom: 8,
    fontWeight: '600', 
    fontSize: 18
  }
})