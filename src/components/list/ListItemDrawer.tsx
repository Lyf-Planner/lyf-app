import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import { Horizontal } from "../../components/MiscComponents";
import { eventsBadgeColor } from "../../utils/constants";
import { Keyboard, TouchableWithoutFeedback } from "react-native";
import { ItemStatusDropdown } from "./item_settings/ItemStatusDropdown";
import { useMemo } from "react";
import { ItemTime } from "./item_settings/ItemTime";
import { ItemNotification } from "./item_settings/ItemNotification";
import { ItemDescription } from "./item_settings/ItemDescription";
import { ItemDate } from "./item_settings/ItemDate";
import { useAuth } from "../../authorisation/AuthProvider";
import { useNotifications } from "../../authorisation/NotificationsLayer";
import { ItemTitle } from "./item_settings/ItemTitle";
import { ItemType } from "./item_settings/ItemType";
import { useItems } from "../../hooks/useItems";
import { useDrawer } from "../../hooks/useDrawer";

export const ListItemDrawer = ({ item_id, closeDrawer, updateDrawerIndex }) => {
  // We setup a local copy of the item so that certain fields can be published when needed
  const { user } = useAuth();
  const { enabled } = useNotifications();
  const { items, updateItem, removeItem } = useItems();
  const item = useMemo(
    () => items.find((x) => x.id === item_id),
    [items, item_id]
  );

  const updateNotification = (enabled, minutes_before, prereqItem = item) => {
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

  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <View style={styles.mainContainer}>
        <View style={{ gap: 8, zIndex: 10 }}>
          <View style={styles.headerBackground}>
            <ItemTitle
              item={item}
              updateItem={updateItem}
              updateDrawerIndex={updateDrawerIndex}
            />
            <View style={{ marginLeft: "auto" }}>
              <ItemType item={item} updateItem={updateItem} />
            </View>
          </View>
          <ItemStatusDropdown item={item} updateItem={updateItem} />
        </View>
        <Horizontal style={styles.firstSeperator} />

        <View
          style={{
            flexDirection: "column",
            gap: 8,
          }}
        >
          <ItemDate item={item} updateItem={updateItem} />

          <ItemTime
            item={item}
            updateItem={updateItem}
            updateNotification={updateNotification}
          />

          <ItemNotification
            enabled={enabled}
            time={item.time}
            notification={
              item.notifications &&
              item.notifications.find((x) => x.user_id === user.id)
            }
            updateNotification={updateNotification}
            updateDrawerIndex={updateDrawerIndex}
          />

          <ItemDescription
            item={item}
            updateItem={updateItem}
            updateDrawerIndex={updateDrawerIndex}
          />
        </View>

        <View style={styles.footer}>
          <Horizontal style={styles.secondSeperator} />
          {user.timetable.items.length <= 1 ? (
            <Text style={styles.subtitle}>
              Swipe items right to access this menu
            </Text>
          ) : (
            <View style={styles.bottomButtonsContainer}>
              <TouchableOpacity
                onPress={() => {
                  removeItem();
                  closeDrawer();
                }}
                style={[styles.bottomButton, { backgroundColor: "red" }]}
                activeOpacity={0.7}
              >
                <Text style={[styles.bottomButtonText, styles.removeText]}>
                  Delete
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={closeDrawer}
                style={[
                  styles.bottomButton,
                  { backgroundColor: eventsBadgeColor },
                ]}
                activeOpacity={0.7}
              >
                <Text style={[styles.bottomButtonText, styles.doneText]}>
                  Close
                </Text>
              </TouchableOpacity>
            </View>
          )}
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
    backgroundColor: "black",
    padding: 10,
    height: 50,
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    borderRadius: 5,
  },
  subtitle: {
    textAlign: "center",
    opacity: 0.4,
    fontWeight: "600",
    fontSize: 15,
  },

  secondSeperator: { opacity: 0.2, marginTop: 16, borderWidth: 2 },
  footer: { gap: 12, position: "relative", bottom: 10 },
  bottomButtonsContainer: { flexDirection: "row", gap: 5 },
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
