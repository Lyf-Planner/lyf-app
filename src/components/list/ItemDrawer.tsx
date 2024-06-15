import { StyleSheet, Text, View } from 'react-native';
import { Horizontal } from '../general/MiscComponents';
import { deepBlue } from '../../utils/colours';
import { Keyboard, TouchableWithoutFeedback } from 'react-native';
import { ItemStatusDropdown } from './drawer_settings/ItemStatusDropdown';
import { useEffect, useMemo, useState } from 'react';
import { ItemTime } from './drawer_settings/ItemTime';
import { ItemNotification } from './drawer_settings/ItemNotification';
import { ItemDescription } from './drawer_settings/ItemDescription';
import { ItemDate } from './drawer_settings/ItemDate';
import { useNotifications } from '../../providers/useNotifications';
import { ItemTitle } from './drawer_settings/ItemTitle';
import { ItemTypeBadge } from './drawer_settings/ItemType';
import { UpdateItem, useTimetable } from '../../providers/useTimetable';
import { AddDetails } from './drawer_settings/AddDetails';
import { OptionsMenu } from './drawer_settings/OptionsMenu';
import { InviteHandler } from './drawer_settings/InviteHandler';
import { ItemUsers } from './drawer_settings/ItemUsers';
import { isTemplate } from './constants';
import { ItemLink } from './drawer_settings/ItemLink';
import { ItemLocation } from './drawer_settings/ItemLocation';
import FontAwesome5Icon from 'react-native-vector-icons/FontAwesome5';
import { LocalItem } from 'schema/items';
import { useDrawer } from 'providers/useDrawer';
import { getItem, updateItemSocial } from 'rest/items';

export type ItemDrawerProps = {
  item: LocalItem,
  updateItem: UpdateItem
}

export const ItemDrawer = ({
  item,
  updateItem,
}: ItemDrawerProps) => {
  const { enabled } = useNotifications();
  const { updateDrawer, updateSheetMinHeight} = useDrawer();
  const [loadingUsers, setLoadingUsers] = useState(!!item.relations?.users);

  useEffect(() => {
    if (loadingUsers) {
      getItem(item.id, "users").then((item) => {
        if (item) {
          updateItem(item.id, item, false)
          setLoadingUsers(false);
        }
      })
    }
  }, [])

  if (!item) {
    // Close this
    updateDrawer(undefined);
    return null;
  }

  const [descOpen, setDescOpen] = useState(!!item?.desc);
  const [linkOpen, setLinkOpen] = useState(!!item?.url);
  const [locationOpen, setLocationOpen] = useState(!!item?.location);

  const noDetails = useMemo(
    () => item && !item.date && !item.time && !descOpen && !item.notification_mins_before,
    [item]
  );

  const conditionalStyles = {
    detailsContainer: {
      opacity: item.invite_pending ? 0.5 : 1
    }
  }

  // Pass "invited" to block any input component with a localised value
  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <View style={styles.mainContainer}>

        {item.invite_pending && (
          <Text style={styles.subtitle}>You've been invited to...</Text>
        )}

        <View style={styles.header}>
          <View style={styles.headerBackground}>
            <View style={styles.itemType}> {/** TODO: Review whether this wrapping View is needed */}
              <ItemTypeBadge item={item} updateItem={updateItem} />
            </View>
            <ItemTitle item={item} updateItem={updateItem} />
            {!item.invite_pending && <OptionsMenu item={item} />}
          </View>

          {item.invite_pending ? (
            <InviteHandler item={item} />
          ) : (
            <ItemStatusDropdown item={item} updateItem={updateItem} />
          )}
        </View>

        <Horizontal style={styles.firstSeperator} />

        <View style={[styles.detailsContainer, conditionalStyles.detailsContainer]}>
          {item.collaborative && (
            <ItemUsers item={item} loading={loadingUsers} />
          )}

          {(item.date || isTemplate(item)) && (
            <ItemDate item={item} updateItem={updateItem} />
          )}

          {item.time && (
            <ItemTime
              item={item}
              updateItem={updateItem}
            />
          )}

          {item.notification_mins_before && (
            <ItemNotification
              item={item}
              updateItem={updateItem}
              updateSheetMinHeight={updateSheetMinHeight}
            />
          )}

          {linkOpen && (
            <ItemLink
              item={item}
              updateItem={updateItem}
              setLinkOpen={setLinkOpen}
              updateSheetMinHeight={updateSheetMinHeight}
            />
          )}

          {locationOpen && (
            <ItemLocation
              item={item}
              updateItem={updateItem}
              setLocationOpen={setLocationOpen}
              updateSheetMinHeight={updateSheetMinHeight}
            />
          )}

          {descOpen && (
            <ItemDescription
              item={item}
              updateItem={updateItem}
              setDescOpen={setDescOpen}
              updateSheetMinHeight={updateSheetMinHeight}
            />
          )}
          {!noDetails && (
            <Horizontal
              style={{ borderColor: 'rgba(0,0,0,0.1)', marginVertical: 4 }}
            />
          )}
          <AddDetails
            item={item}
            updateItem={updateItem}
            setDescOpen={setDescOpen}
            descOpen={descOpen}
            setLinkOpen={setLinkOpen}
            linkOpen={linkOpen}
            setLocationOpen={setLocationOpen}
            locationOpen={locationOpen}
          />
        </View>

        <View style={styles.footer}>
          <FontAwesome5Icon
            name="chevron-down"
            size={16}
            color="rgba(0,0,0,0.3)"
          />
          <Text style={styles.subtitle}>Swipe down to close</Text>
          <FontAwesome5Icon
            name="chevron-down"
            size={16}
            color="rgba(0,0,0,0.3)"
          />
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    backgroundColor: 'white',
    paddingHorizontal: 18,
    borderColor: 'rgba(0,0,0,0.5)',
    gap: 10,
    paddingBottom: 40
  },
  header: { 
    gap: 8, 
    zIndex: 10 
  },
  itemType: { 
    marginLeft: 'auto',
    marginRight: 8 
  },
  firstSeperator: {
    opacity: 0.25,
    marginBottom: 2,
    borderWidth: 2
  },
  detailsContainer: {
    flexDirection: 'column',
    gap: 8,
  },
  headerBackground: {
    backgroundColor: deepBlue,
    padding: 8,
    height: 50,
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    borderRadius: 5,
    shadowColor: 'black',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 2
  },
  subtitle: {
    textAlign: 'center',
    opacity: 0.4,
    fontWeight: '600',
    fontSize: 15
  },

  secondSeperator: { opacity: 0.2, marginTop: 16, borderWidth: 2 },
  footer: {
    gap: 12,
    position: 'relative',
    bottom: 10,
    marginTop: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center'
  },
  bottomButtonsContainer: {
    flexDirection: 'row',
    gap: 5,
    shadowColor: 'black',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 3
  },
  bottomButton: {
    padding: 12,
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 0.5,
    borderRadius: 10
  },
  bottomButtonText: {
    fontSize: 16,
    textAlign: 'center'
  },
  doneText: { fontWeight: '600' },
  removeText: { color: 'white' }
});
