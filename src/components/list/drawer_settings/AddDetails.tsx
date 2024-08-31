import {
  View,
  Text,
  StyleSheet,
  TouchableHighlight,
  Alert
} from 'react-native';
import { primaryGreen } from '../../../utils/colours';
import { formatDateData } from '../../../utils/dates';
import { useNotifications } from 'providers/cloud/useNotifications';
import { useModal } from 'providers/overlays/useModal';
// import { AddFriendsModal } from './AddFriendsModal';
import { isTemplate } from '../constants';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import FontAwesome5Icon from 'react-native-vector-icons/FontAwesome5';
import { ItemDrawerProps } from '../ItemDrawer';
import { ItemType } from 'schema/database/items';
import { AddFriendsModal } from './AddFriendsModal';
import { useAuth } from 'providers/cloud/useAuth';

// The button component can definitely be abstracted here

type Props = ItemDrawerProps & {
  setDescOpen: (open: boolean) => void,
  descOpen: boolean,
  setLinkOpen: (open: boolean) => void,
  linkOpen: boolean,
  setLocationOpen: (open: boolean) => void,
  locationOpen: boolean,
}

export const AddDetails = ({
  item,
  updateItem,
  setDescOpen,
  descOpen,
  setLinkOpen,
  linkOpen,
  setLocationOpen,
  locationOpen,
}: Props) => {
  const { user } = useAuth();
  const { enabled, getDefaultNotificationMins } = useNotifications();
  const { updateModal } = useModal();

  return (
    <View style={styles.mainContainer}>
      <View style={styles.detailsListWrapper}>
        {!item.note_id && (
          <TouchableHighlight
            style={styles.addFieldContainer}
            underlayColor={'rgba(0,0,0,0.5)'}
            disabled={item.invite_pending}
            onPress={() => updateModal(<AddFriendsModal item_id={item.id} />)}
          >
            <View style={styles.addFieldContent}>
              <Text style={styles.addFieldText}>+</Text>
              <FontAwesome5Icon name="users" color={'white'} size={16} />
              <Text style={styles.addFieldText}>Invite Friends</Text>
            </View>
          </TouchableHighlight>
        )}

        {!item.date && !isTemplate(item) && (
          <TouchableHighlight
            style={styles.addFieldContainer}
            underlayColor={'rgba(0,0,0,0.5)'}
            disabled={item.invite_pending}
            onPress={() => updateItem(item, { date: formatDateData(new Date()) })}
          >
            <View style={styles.addFieldContent}>
              <Text style={styles.addFieldText}>+</Text>
              <MaterialIcons name="date-range" color={'white'} size={18} />
              <Text style={styles.addFieldText}>Date</Text>
            </View>
          </TouchableHighlight>
        )}

        {!item.time && item.type !== ItemType.Task && (
          <TouchableHighlight
            style={styles.addFieldContainer}
            underlayColor={'rgba(0,0,0,0.5)'}
            disabled={item.invite_pending}
            onPress={() => updateItem(item, { time: '09:00', notification_mins: user?.event_notification_mins })}
          >
            <View style={styles.addFieldContent}>
              <Text style={styles.addFieldText}>+</Text>
              <MaterialIcons name="access-time" color={'white'} size={18} />
              <Text style={styles.addFieldText}>Time</Text>
            </View>
          </TouchableHighlight>
        )}

        {!item.notification_mins && !item.note_id && (
          <TouchableHighlight
            style={styles.addNotificationContainer}
            underlayColor={'rgba(0,0,0,0.5)'}
            disabled={item.invite_pending}
            onPress={() => {
              if (!item.time || !item.date) {
                Alert.alert(
                  'Lyf Tip',
                  'Add a date and time before setting a reminder :)'
                );
                return;
              }

              if (!enabled) {
                Alert.alert(
                  'Lyf Tip',
                  'You need to enable Notifications for Lyf in your device settings'
                );
                return;
              } 
            
              updateItem(item, { notification_mins: getDefaultNotificationMins() })
            }}
          >
            <View style={styles.addFieldContent}>
              <Text style={styles.addNotificationText}>+</Text>
              <MaterialIcons
                name="notifications-active"
                color={'white'}
                size={18}
              />
              <Text style={styles.addNotificationText}>Reminder</Text>
            </View>
          </TouchableHighlight>
        )}

        {!linkOpen && (
          <TouchableHighlight
            style={styles.addFieldContainer}
            underlayColor={'rgba(0,0,0,0.5)'}
            disabled={item.invite_pending}
            onPress={() => {
              setLinkOpen(true);
              updateItem(item, { url: '' });
            }}
          >
            <View style={styles.addFieldContent}>
              <Text style={styles.addFieldText}>+</Text>
              <MaterialIcons name="link" color={'white'} size={18} />
              <Text style={styles.addFieldText}>Link</Text>
            </View>
          </TouchableHighlight>
        )}

        {!locationOpen && (
          <TouchableHighlight
            style={styles.addFieldContainer}
            underlayColor={'rgba(0,0,0,0.5)'}
            disabled={item.invite_pending}
            onPress={() => {
              setLocationOpen(true);
              updateItem(item, { location: '' });
            }}
          >
            <View style={styles.addFieldContent}>
              <Text style={styles.addFieldText}>+</Text>
              <MaterialIcons name="location-pin" color={'white'} size={18} />
              <Text style={styles.addFieldText}>Location</Text>
            </View>
          </TouchableHighlight>
        )}

        {!descOpen && (
          <TouchableHighlight
            style={styles.addFieldContainer}
            underlayColor={'rgba(0,0,0,0.5)'}
            onPress={() => {
              setDescOpen(true);
              updateItem(item, { desc: '' });
            }}
          >
            <View style={styles.addFieldContent}>
              <Text style={styles.addFieldText}>+</Text>
              <MaterialIcons name="edit" color={'white'} size={18} />
              <Text style={styles.addFieldText}>Description</Text>
            </View>
          </TouchableHighlight>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flexDirection: 'column',
    gap: 8,
    zIndex: 0
  },
  headingContainer: {
    height: 35,
    flexDirection: 'column'
  },
  headingText: { fontSize: 20, fontWeight: '500', fontFamily: 'InterSemi' },
  detailsListWrapper: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    gap: 4
  },
  addFieldContainer: {
    backgroundColor: primaryGreen,
    padding: 8.75,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center'
  },
  addFieldContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4
  },
  addFieldText: {
    fontSize: 16,
    textAlignVertical: 'center',
    color: 'white'
  },

  addNotificationContainer: {
    backgroundColor: primaryGreen,
    padding: 8.75,
    borderRadius: 8
  },
  addNotificationText: {
    fontSize: 16,
    color: 'white'
  }
});
