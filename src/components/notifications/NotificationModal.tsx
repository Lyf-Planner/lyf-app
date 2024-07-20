import * as Native from 'react-native';

import { useNotifications } from "providers/cloud/useNotifications"
import { useModal } from "providers/overlays/useModal"
import { primaryGreen, white } from 'utils/colours';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { NotificationBanner } from './NotificationBanner';
import { Horizontal } from 'components/general/MiscComponents';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';


export const NotificationModal = () => {
  const { notifications } = useNotifications();
  const { updateModal } = useModal();

  console.log('notifications', notifications);

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

        <Horizontal />

        <Native.ScrollView contentContainerStyle={styles.scrollWrapper}>
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
    width: 350,

    shadowColor: 'black',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2
  },
  mainInternal: {
    backgroundColor: white,
    flexDirection: 'column',
    overflow: 'hidden',
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
    gap: 8,
    paddingVertical: 10,
    paddingHorizontal: 10,
  }
})