import { useEffect, useMemo, useState } from 'react';
import { Keyboard, TouchableWithoutFeedback } from 'react-native';
import { Platform, StyleSheet, Text, View } from 'react-native';

import FontAwesome5Icon from 'react-native-vector-icons/FontAwesome5';

import { Horizontal } from '@/components/Horizontal';
import { AddDetails } from '@/components/item_drawer/AddDetails';
import { InviteHandler } from '@/components/item_drawer/InviteHandler';
import { ItemDate } from '@/components/item_drawer/ItemDate';
import { ItemDescription } from '@/components/item_drawer/ItemDescription';
import { ItemLink } from '@/components/item_drawer/ItemLink';
import { ItemLocation } from '@/components/item_drawer/ItemLocation';
import { ItemNotification } from '@/components/item_drawer/ItemNotification';
import { ItemStatusDropdown } from '@/components/item_drawer/ItemStatusDropdown';
import { ItemTime } from '@/components/item_drawer/ItemTime';
import { ItemTitle } from '@/components/item_drawer/ItemTitle';
import { ItemTypeBadge } from '@/components/item_drawer/ItemType';
import { ItemUsers } from '@/components/item_drawer/ItemUsers';
import { OptionsMenu } from '@/components/item_drawer/OptionsMenu';
import { getItem } from '@/rest/items';
import { ID } from '@/schema/database/abstract';
import { useTimetable } from '@/shell/cloud/useTimetable';
import { useDrawer } from '@/shell/overlays/useDrawer';
import { black, blackWithOpacity, deepBlue, white } from '@/utils/colours';
import { isTemplate, ItemDrawerProps } from '@/utils/item';

type Props = {
  id: ID,
  isNew?: boolean
}

export const ItemDrawer = ({
  id,
  isNew = false
}: Props) => {
  // Establish item from store
  const { updateDrawer, updateSheetMinHeight } = useDrawer();
  const { items, updateItem } = useTimetable();
  const item = useMemo(() => Object.values(items).find((x) => x.id === id), [items]);

  const [descOpen, setDescOpen] = useState(!!item?.desc);
  const [linkOpen, setLinkOpen] = useState(!!item?.url);
  const [locationOpen, setLocationOpen] = useState(!!item?.location);

  const noDetails = useMemo(
    () => item && !item.date && !item.time && !descOpen && !item.notification_mins,
    [item]
  );

  useEffect(() => {
    if (item && !item.localised) {
      getItem(item.id, 'users').then((updatedItem) => {
        if (updatedItem) {
          // We do this to keep the item as a UserRelatedItem
          const mergedData = {
            ...item,
            ...updatedItem
          }
          updateItem(item, mergedData, false)
        }
      })
    }
  }, [item?.localised])

  if (!item) {
    // Close this
    updateDrawer(undefined);
    return null;
  }

  // Establish props passed to children
  const props: ItemDrawerProps = {
    item,
    updateItem,
    updateDrawer,
    updateSheetMinHeight
  }

  const conditionalStyles = {
    detailsContainer: {
      opacity: item.invite_pending ? 0.5 : 1
    }
  }

  // Pass "invited" to block any input component with a localised value
  return (
    <TouchableWithoutFeedback onPress={() => Platform.OS === 'web' ? null : Keyboard.dismiss()}>
      <View style={styles.mainContainer}>

        {item.invite_pending && (
          <Text style={styles.subtitle}>You've been invited to...</Text>
        )}

        <View style={styles.header}>
          <View style={styles.headerBackground}>
            <View style={styles.itemType}>{/** TODO: Review whether this wrapping View is needed */}
              <ItemTypeBadge {...props} />
            </View>
            <ItemTitle {...props} autoFocus={isNew} />
            {!item.invite_pending &&
              <OptionsMenu
                item={item}
                closeDrawer={() => updateDrawer(undefined)}
              />
            }
          </View>

          {item.invite_pending ? (
            <InviteHandler item={item} />
          ) : (
            <ItemStatusDropdown {...props} />
          )}
        </View>

        <Horizontal style={styles.firstSeperator} />

        <View style={[styles.detailsContainer, conditionalStyles.detailsContainer]}>
          {!item.note_id &&
            <ItemUsers
              item={item}
              loading={!item.relations?.users}
              closeDrawer={() => updateDrawer(undefined)}
            />
          }

          {(item.date || isTemplate(item)) && (
            <ItemDate {...props} />
          )}

          {item.time && (
            <ItemTime {...props} />
          )}

          {item.notification_mins && (
            <ItemNotification {...props} />
          )}

          {linkOpen && (
            <ItemLink setLinkOpen={setLinkOpen} {...props} />
          )}

          {locationOpen && (
            <ItemLocation setLocationOpen={setLocationOpen} {...props} />
          )}

          {descOpen && (
            <ItemDescription setDescOpen={setDescOpen} {...props} />
          )}
          {!noDetails && (
            <Horizontal
              style={styles.detailsSeperator}
            />
          )}
          <AddDetails
            {...props}
            setDescOpen={setDescOpen}
            descOpen={descOpen}
            setLinkOpen={setLinkOpen}
            linkOpen={linkOpen}
            setLocationOpen={setLocationOpen}
            locationOpen={locationOpen}
          />
        </View>

        {Platform.OS !== 'web' && (
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
        )}
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  detailsContainer: {
    flexDirection: 'column',
    gap: 8
  },
  detailsSeperator: {
    borderColor: blackWithOpacity(0.1),
    marginVertical: 4
  },
  firstSeperator: {
    borderWidth: 2,
    marginBottom: 2,
    opacity: 0.25
  },
  footer: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 12,
    justifyContent: 'center',
    marginTop: 10,
    position: 'relative'
  },

  header: {
    gap: 8,
    zIndex: 10
  },
  headerBackground: {
    alignItems: 'center',
    backgroundColor: deepBlue,
    borderRadius: 5,
    flexDirection: 'row',
    height: 50,
    padding: 8,
    shadowColor: black,

    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.7,
    shadowRadius: 3,
    width: '100%'
  },
  itemType: {
    marginLeft: 'auto',
    marginRight: 8
  },
  mainContainer: {
    backgroundColor: white,
    borderColor: blackWithOpacity(0.5),
    borderRadius: Platform.OS === 'web' ? 20 : 0,
    gap: 10,
    maxWidth: 500,
    paddingBottom: Platform.OS === 'web' ? 20 : 40,
    paddingHorizontal: 18,
    paddingTop: Platform.OS === 'web' ? 20 : 0,
    width: Platform.OS === 'web' ? 500 : 'auto'
  },
  subtitle: {
    fontFamily: 'Lexend',
    fontSize: 16,
    fontWeight: '600',
    opacity: 0.4,
    textAlign: 'center'
  }
});
