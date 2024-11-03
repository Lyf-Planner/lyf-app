import { Platform, StyleSheet, Text, View } from 'react-native';
import { Horizontal } from 'components/Horizontal';
import { deepBlue } from 'utils/colours';
import { Keyboard, TouchableWithoutFeedback } from 'react-native';
import { ItemStatusDropdown } from 'components/item_drawer/ItemStatusDropdown';
import { useEffect, useMemo, useState } from 'react';
import { ItemTime } from 'components/item_drawer/ItemTime';
import { ItemNotification } from 'components/item_drawer/ItemNotification';
import { ItemDescription } from 'components/item_drawer/ItemDescription';
import { ItemDate } from 'components/item_drawer/ItemDate';
import { ItemTitle } from 'components/item_drawer/ItemTitle';
import { ItemTypeBadge } from 'components/item_drawer/ItemType';
import { UpdateItem, useTimetable } from 'hooks/cloud/useTimetable';
import { AddDetails } from 'components/item_drawer/AddDetails';
import { OptionsMenu } from 'components/item_drawer/OptionsMenu';
import { InviteHandler } from 'components/item_drawer/InviteHandler';
import { ItemUsers } from 'components/item_drawer/ItemUsers';
import { isTemplate } from 'utils/item';
import { ItemLink } from 'components/item_drawer/ItemLink';
import { ItemLocation } from 'components/item_drawer/ItemLocation';
import FontAwesome5Icon from 'react-native-vector-icons/FontAwesome5';
import { LocalItem } from 'schema/items';
import { getItem } from 'rest/items';
import { ID } from 'schema/database/abstract';
import { useDrawer } from 'hooks/overlays/useDrawer';
import { ItemDbObject } from 'schema/database/items';
import { useNotes } from 'hooks/cloud/useNotes';

type Props = {
  id: ID,
  noteId: ID,
  isNew?: boolean
}

export const NoteItemDrawer = ({
  id,
  noteId,
  isNew = false
}: Props) => {
  // Establish item from store
  const { updateDrawer, updateSheetMinHeight } = useDrawer();
  const { updateItem } = useTimetable();
  const { notes } = useNotes();

  const item = useMemo(() => {
    const relevantNote = notes.find((x) => x.id === noteId);
    if (relevantNote && relevantNote.relations?.items) {
      return relevantNote.relations.items.find((x) => x.id === id);
    }
  }, [notes]);

  const [descOpen, setDescOpen] = useState(!!item?.desc);
  const [linkOpen, setLinkOpen] = useState(!!item?.url);
  const [locationOpen, setLocationOpen] = useState(!!item?.location);

  const noDetails = useMemo(
    () => item && !item.date && !item.time && !descOpen,
    [item]
  );

  if (!item) {
    // Close this
    updateDrawer(undefined);
    return null;
  }

  // Establish props passed to children
  const props = {
    item: item as LocalItem,
    updateItem: updateItem as UpdateItem,
    updateDrawer,
    updateSheetMinHeight
  }

  // Pass "invited" to block any input component with a localised value
  return (
    <TouchableWithoutFeedback onPress={() => Platform.OS === 'web' ? null : Keyboard.dismiss()}>
      <View style={styles.mainContainer}>
        <View style={styles.header}>
          <View style={styles.headerBackground}>
            <View style={styles.itemType}>{/** TODO: Review whether this wrapping View is needed */}
              <ItemTypeBadge {...props} />
            </View>
            <ItemTitle {...props} autoFocus={isNew} />
          </View>

          <ItemStatusDropdown {...props} />
        </View>

        <Horizontal style={styles.firstSeperator} />

        <View style={[styles.detailsContainer]}>
          {(item.date || isTemplate(item)) && (
            <ItemDate {...props} />
          )}

          {item.time && (
            <ItemTime {...props} />
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
              style={{ borderColor: 'rgba(0,0,0,0.1)', marginVertical: 4 }}
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
  mainContainer: {
    width: Platform.OS === 'web' ? 500 : 'auto',
    maxWidth: 500,
    borderRadius: Platform.OS === 'web' ? 20 : 0,
    backgroundColor: 'white',
    paddingHorizontal: 18,
    borderColor: 'rgba(0,0,0,0.5)',
    gap: 10,
    paddingBottom: Platform.OS === 'web' ? 20 : 40,
    paddingTop: Platform.OS === 'web' ? 20 : 0
  },
  header: { 
    gap: 8, 
    zIndex: 10,
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
    shadowOpacity: 0.7,
    shadowRadius: 3
  },
  subtitle: {
    textAlign: 'center',
    opacity: 0.4,
    fontWeight: '600',
    fontSize: 16,
    fontFamily: 'Lexend'
  },

  secondSeperator: { opacity: 0.2, marginTop: 16, borderWidth: 2 },
  footer: {
    gap: 12,
    position: 'relative',
    marginTop: 10,
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
