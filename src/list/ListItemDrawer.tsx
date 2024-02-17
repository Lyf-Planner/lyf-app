import { StyleSheet, Text, View } from "react-native";
import { Horizontal } from "../components/MiscComponents";
import { deepBlue } from "../utils/constants";
import { Keyboard, TouchableWithoutFeedback } from "react-native";
import { ItemStatusDropdown } from "./item_settings/ItemStatusDropdown";
import { useMemo, useState } from "react";
import { ItemTime } from "./item_settings/ItemTime";
import { ItemNotification } from "./item_settings/ItemNotification";
import { ItemDescription } from "./item_settings/ItemDescription";
import { ItemDate } from "./item_settings/ItemDate";
import { useAuth } from "../authorisation/AuthProvider";
import { useNotifications } from "../authorisation/NotificationsLayer";
import { ItemTitle } from "./item_settings/ItemTitle";
import { ItemType } from "./item_settings/ItemType";
import { useItems } from "../hooks/useItems";
import { AddDetails } from "./item_settings/AddDetails";
import { OptionsMenu } from "./item_settings/OptionsMenu";
import { InviteHandler } from "./item_settings/InviteHandler";
import { ItemUsers } from "./item_settings/ItemUsers";
import FontAwesome5Icon from "react-native-vector-icons/FontAwesome5";

export const ListItemDrawer = ({ item_id, closeDrawer, updateSheetMinHeight }) => {
  // We setup a local copy of the item so that certain fields can be published when needed
  const { user } = useAuth();
  const { enabled } = useNotifications();
  const { items, updateItem } = useItems();

  const item = useMemo(() => {
    console.log("Received items updated with", items.length, "items");
    return items.find((x) => x.id === item_id);
  }, [items, item_id]);
  if (!item) closeDrawer();

  const notification = useMemo(
    () =>
      item?.notifications &&
      enabled &&
      item.notifications.find((x) => x.user_id === user.id),
    [item]
  );

  const invited = useMemo(
    () =>
      item?.invited_users &&
      !!item.invited_users?.find((x) => x.user_id === user.id),
    [item?.invited_users, user]
  );
  const [descOpen, setDescOpen] = useState(!!item?.desc);

  // Is outside notifications component due to automatic notif setting
  const updateNotification = (enabled, minutes_before, prereqItem = item) => {
    if (invited) return;

    var tmp = item.notifications || [];
    var userIndex = tmp.findIndex((x) => x.user_id === user.id);
    if (userIndex === -1) {
      if (!enabled) return;
      else
        tmp.push({
          user_id: user.id,
          minutes_before:
            user.premium?.notifications?.event_notification_minutes_before ||
            "5",
        });
    } else {
      if (!enabled) tmp.splice(userIndex, 1);
      else tmp[userIndex].minutes_before = minutes_before;
    }
    updateItem({ ...prereqItem, notifications: tmp });
  };
  const updateNotify = (notify) => updateNotification(!!notify, "");
  const updateMinutes = (minutes_before) =>
    updateNotification(true, minutes_before);

  const noDetails = useMemo(
    () => item && !item.date && !item.time && !descOpen && !notification,
    [item, notification]
  );

  if (!item) return null;
  // Pass "invited" to block any input component with a localised value
  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <View style={styles.mainContainer}>
        {invited && (
          <Text style={styles.subtitle}>You've been invited to...</Text>
        )}
        <View style={{ gap: 8, zIndex: 10 }}>
          <View style={styles.headerBackground}>
            <View style={{ marginLeft: "auto", marginRight: 8 }}>
              <ItemType item={item} updateItem={updateItem} invited={invited} />
            </View>
            <ItemTitle
              item={item}
              updateItem={updateItem}
              invited={invited}
              updateSheetMinHeight={updateSheetMinHeight}
            />
            {!invited && <OptionsMenu item={item} />}
          </View>
          {invited ? (
            <InviteHandler item={item} />
          ) : (
            <ItemStatusDropdown item={item} updateItem={updateItem} />
          )}
        </View>
        <Horizontal style={styles.firstSeperator} />

        <View
          style={{
            flexDirection: "column",
            gap: 8,
            opacity: invited ? 0.5 : 1,
          }}
        >
          {item.permitted_users.concat(item.invited_users || []).length > 1 && (
            <ItemUsers item={item} />
          )}

          {item.date && (
            <ItemDate item={item} updateItem={updateItem} invited={invited} />
          )}

          {item.time && (
            <ItemTime
              item={item}
              updateItem={updateItem}
              updateNotification={updateNotification}
              invited={invited}
            />
          )}

          {notification && (
            <ItemNotification
              item={item}
              notification={notification}
              updateNotify={updateNotify}
              updateMinutes={updateMinutes}
              invited={invited}
            />
          )}

          {descOpen && (
            <ItemDescription
              item={item}
              updateItem={updateItem}
              setDescOpen={setDescOpen}
              invited={invited}
              updateSheetMinHeight={updateSheetMinHeight}
            />
          )}
          {!noDetails && (
            <Horizontal
              style={{ borderColor: "rgba(0,0,0,0.1)", marginVertical: 4 }}
            />
          )}
          <AddDetails
            item={item}
            updateItem={updateItem}
            notification={notification}
            updateNotify={updateNotify}
            setDescOpen={setDescOpen}
            descOpen={descOpen}
            invited={invited}
          />
        </View>

        <View style={styles.footer}>
          <FontAwesome5Icon
            name="chevron-down"
            size={16}
            color="rgba(0,0,0,0.3)"
          />
          <Text style={[styles.subtitle]}>Swipe down to close</Text>
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
    backgroundColor: "white",
    paddingHorizontal: 18,
    borderColor: "rgba(0,0,0,0.5)",
    gap: 10,
    paddingBottom: 40,
  },
  header: {
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    gap: 4,
    marginBottom: 4,
  },
  firstSeperator: {
    opacity: 0.25,

    marginBottom: 2,
    borderWidth: 2,
  },
  headerBackground: {
    backgroundColor: deepBlue,
    padding: 8,
    height: 50,
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    borderRadius: 5,
    shadowColor: "black",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 2,
  },
  subtitle: {
    textAlign: "center",
    opacity: 0.4,
    fontWeight: "600",
    fontSize: 15,
  },

  secondSeperator: { opacity: 0.2, marginTop: 16, borderWidth: 2 },
  footer: {
    gap: 12,
    position: "relative",
    bottom: 10,
    marginTop: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  bottomButtonsContainer: {
    flexDirection: "row",
    gap: 5,
    shadowColor: "black",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 3,
  },
  bottomButton: {
    padding: 12,
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 0.5,
    borderRadius: 10,
  },
  bottomButtonText: {
    fontSize: 16,
    textAlign: "center",
  },
  doneText: { fontWeight: "600" },
  removeText: { color: "white" },
});
