import {
  View,
  Text,
  StyleSheet,
  TouchableHighlight,
  Alert,
} from "react-native";
import { offWhite, primaryGreen } from "../../../utils/constants";
import { formatDateData } from "../../../utils/dates";
import { useNotifications } from "../../../authorisation/NotificationsLayer";

export const AddDetails = ({
  item,
  updateItem,
  notification,
  updateNotify,
  updateDrawerIndex,
  setDescOpen,
}) => {
  const { enabled } = useNotifications();
  return (
    <View style={styles.mainContainer}>
      <View style={styles.detailsListWrapper}>
        {!item.date && (
          <TouchableHighlight
            style={styles.addFieldContainer}
            underlayColor={"rgba(0,0,0,0.5)"}
            onPress={() => {
              updateItem({ ...item, date: formatDateData(new Date()) });
            }}
          >
            <Text style={styles.addFieldText}>Add Date +</Text>
          </TouchableHighlight>
        )}
        {!item.time && (
          <TouchableHighlight
            style={styles.addFieldContainer}
            underlayColor={"rgba(0,0,0,0.5)"}
            onPress={() => {
              updateItem({ ...item, time: "09:00" });
            }}
          >
            <Text style={styles.addFieldText}>Add Time +</Text>
          </TouchableHighlight>
        )}
        {!notification && (
          <TouchableHighlight
            style={styles.addNotificationContainer}
            underlayColor={"rgba(0,0,0,0.5)"}
            onPress={() => {
              if (!item.time)
                Alert.alert(
                  "Tip",
                  "You need to add a time before setting a reminder :)"
                );
              else if (!enabled) {
                Alert.alert(
                  "Whoops",
                  "You need to enable Notifications for Lyf in your device settings"
                );
              } else updateNotify(true);
            }}
          >
            <Text style={styles.addNotificationText}>Add Reminder +</Text>
          </TouchableHighlight>
        )}
        {!item.desc && (
          <TouchableHighlight
            style={styles.addFieldContainer}
            underlayColor={"rgba(0,0,0,0.5)"}
            onPress={() => {
              setDescOpen(true);
              updateItem({ ...item, desc: "" });
              updateDrawerIndex(1);
            }}
          >
            <Text style={styles.addFieldText}>Add Description +</Text>
          </TouchableHighlight>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flexDirection: "column",
    gap: 8,
    zIndex: 0,
  },
  headingContainer: {
    height: 35,
    flexDirection: "column",
  },
  headingText: { fontSize: 20, fontWeight: "500", fontFamily: "InterSemi" },
  detailsListWrapper: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    gap: 4,
  },
  addFieldContainer: {
    backgroundColor: primaryGreen,
    padding: 8.75,
    borderRadius: 8,
    flexDirection: "row",
    alignItems: "center",
  },
  addFieldText: {
    fontSize: 16,
    textAlignVertical: "center",
    color: "white",
  },

  addNotificationContainer: {
    backgroundColor: primaryGreen,
    padding: 8.75,
    borderRadius: 8,
  },
  addNotificationText: {
    fontSize: 16,
    color: "white",
  },
});
