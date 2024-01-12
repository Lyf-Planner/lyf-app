import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput,
} from "react-native";
import { Horizontal, Loader } from "../../components/MiscComponents";
import { eventsBadgeColor, offWhite } from "../../utils/constants";
import { ItemStatus, ListItemType, isTemplate } from "./constants";
import { Keyboard, TouchableWithoutFeedback } from "react-native";

import { ItemStatusDropdown } from "./itemSettings/ItemStatusDropdown";
import { useState } from "react";
import { ItemEventTime } from "./itemSettings/ItemEventTime";
import { ItemNotification } from "./itemSettings/ItemNotification";
import { ItemDescription } from "./itemSettings/ItemDescription";
import { ItemDate } from "./itemSettings/ItemDate";
import { TouchableHighlight } from "react-native-gesture-handler";
import { useAuth } from "../../authorisation/AuthProvider";
import { useNotifications } from "../../authorisation/NotificationsLayer";

export const ListItemDrawer = ({
  initialItem,
  updateRootItem,
  removeItem,
  closeModal,
  updateDrawerIndex,
}) => {
  // We setup a local copy of the item so that certain fields can be published when needed
  const [item, updateLocalItem] = useState(initialItem);
  const { user } = useAuth();
  const { enabled } = useNotifications();
  const publishUpdate = () => {
    updateRootItem({ ...item });
  };

  const updateStatus = (status) => {
    updateLocalItem({ ...item, status });
    updateRootItem({ ...item, status });
  };

  const updateTitle = (title) => updateLocalItem({ ...item, title });

  const updateTime = (time) => {
    if (
      !item.time &&
      user.premium?.enabled &&
      user.premium?.event_notifications
    ) {
    }
    updateLocalItem({ ...item, time });
    updateRootItem({ ...item, time });
  };

  const switchType = () => {
    var newItem = { ...item };
    if (item.type === ListItemType.Task) {
      newItem.type = ListItemType.Event;
    } else {
      newItem.type = ListItemType.Task;
    }

    updateLocalItem(newItem);
    updateRootItem(newItem);
  };

  const updateDate = (date) => {
    updateLocalItem({ ...item, date });
    updateRootItem({ ...item, date });
  };

  const updateNotification = (enabled, minutes_before) => {
    var tmp = item.notifications || [];
    var userIndex = tmp.findIndex((x) => x.user_id === user.id);
    if (userIndex === -1) {
      if (!enabled) return;
      else
        tmp.push({
          user_id: user.id,
          minutes_before:
            user.premium?.notifications?.event_notification_minutes_before || 5,
        });
    } else {
      if (!enabled) tmp.splice(userIndex, 1);
      else tmp[userIndex].minutes_before = minutes_before;
    }
    updateLocalItem({ ...item, notifications: tmp });
    updateRootItem({ ...item, notifications: tmp });
  };

  const updateDesc = (desc) => updateLocalItem({ ...item, desc });

  console.log(
    "notification searched as",
    item,
    item.notifications && item.notifications.find((x) => x.user_id === user.id)
  );

  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <View style={styles.mainContainer}>
        <View style={{ gap: 10, zIndex: 10 }}>
          <View style={styles.headerBackground}>
            <TextInput
              value={item.title}
              onChangeText={updateTitle}
              style={styles.itemName}
              onFocus={() => updateDrawerIndex(1)}
              onBlur={() => {
                !item.desc && updateDrawerIndex(0);
                publishUpdate();
              }}
              returnKeyType="done"
            />
            <View style={{ marginLeft: "auto" }}>
              <TouchableHighlight
                style={styles.typeBadge}
                onPress={switchType}
                underlayColor={"rgba(0,0,0,0.5)"}
              >
                <Text style={styles.typeText}>{item.type}</Text>
              </TouchableHighlight>
            </View>
          </View>
          <ItemStatusDropdown
            status={item.status}
            updateStatus={updateStatus}
            type={item.type}
          />
        </View>
        <Horizontal style={styles.firstSeperator} />

        <View
          style={{
            flexDirection: "column",
            gap: 8,
          }}
        >
          <ItemDate
            date={item.date}
            updateDate={updateDate}
            routineDay={isTemplate(item) ? item.day : null}
          />

          <ItemEventTime time={item.time} updateTime={updateTime} />

          {user.premium?.enabled && (
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
          )}
          {user.premium?.enabled && (
            <ItemDescription
              item={item}
              updateDesc={updateDesc}
              publishUpdate={publishUpdate}
              updateDrawerIndex={updateDrawerIndex}
            />
          )}
        </View>

        <View style={styles.footer}>
          <Horizontal style={styles.secondSeperator} />
          <View style={styles.bottomButtonsContainer}>
            <TouchableOpacity
              onPress={() => {
                removeItem();
                closeModal();
              }}
              style={[styles.bottomButton, { backgroundColor: "red" }]}
              activeOpacity={0.7}
            >
              <Text style={[styles.bottomButtonText, styles.removeText]}>
                Delete
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={closeModal}
              style={[
                styles.bottomButton,
                { backgroundColor: eventsBadgeColor },
              ]}
              activeOpacity={0.7}
            >
              <Text style={[styles.bottomButtonText, styles.doneText]}>
                Done
              </Text>
            </TouchableOpacity>
          </View>
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
    marginTop: 2,
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
  itemName: {
    fontSize: 20,
    fontWeight: "600",
    color: "white",
    flex: 1,
  },
  typeBadge: {
    backgroundColor: eventsBadgeColor,
    marginLeft: "auto",
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 10,
  },
  typeText: {
    fontSize: 16,
  },
  subtitle: {
    textAlign: "center",
    opacity: 0.6,
    fontWeight: "600",
    fontSize: 15,
  },

  secondSeperator: { opacity: 0.2, marginTop: 16, borderWidth: 2 },
  footer: { gap: 10, position: "relative", bottom: 10 },
  bottomButtonsContainer: { flexDirection: "row", gap: 5, marginTop: 6 },
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
function updateModal(arg0: null) {
  throw new Error("Function not implemented.");
}
