import {
  View,
  Text,
  StyleSheet,
  TouchableHighlight,
  Alert
} from 'react-native';

import { useAuth } from 'hooks/cloud/useAuth';
import { useNotifications } from 'hooks/cloud/useNotifications';
import { useModal } from 'hooks/overlays/useModal';
import FontAwesome5Icon from 'react-native-vector-icons/FontAwesome5';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { ItemType } from 'schema/database/items';
import { primaryGreen } from 'utils/colours';
import { formatDateData } from 'utils/dates';
import { isTemplate } from 'utils/item';
import { ItemDrawerProps } from 'utils/item';

import { AddFriendsModal } from './AddFriendsModal';

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
  locationOpen
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
            onPress={() => updateItem(item, {
              time: '09:00',
              notification_mins: item.date ? user?.event_notification_mins : undefined
            })}
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
  addFieldContainer: {
    alignItems: 'center',
    backgroundColor: primaryGreen,
    borderRadius: 8,
    flexDirection: 'row',
    padding: 8.75
  },
  addFieldContent: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 4
  },
  addFieldText: {
    color: white,
    fontSize: 16,
    textAlignVertical: 'center'
  },
  addNotificationContainer: {
    backgroundColor: primaryGreen,
    borderRadius: 8,
    padding: 8.75
  },
  addNotificationText: {
    color: white,
    fontSize: 16
  },
  detailsListWrapper: {
    alignItems: 'center',
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 4
  },
  headingContainer: {
    flexDirection: 'column',
    height: 35
  },

  headingText: { fontFamily: 'InterSemi', fontSize: 20, fontWeight: '500' },
  mainContainer: {
    flexDirection: 'column',
    gap: 8,
    zIndex: 0
  }
});
