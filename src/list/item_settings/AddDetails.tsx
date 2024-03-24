import {
  View,
  Text,
  StyleSheet,
  TouchableHighlight,
  Alert,
} from "react-native";
import { primaryGreen } from "../../utils/constants";
import { formatDateData } from "../../utils/dates";
import { useNotifications } from "../../authorisation/NotificationsLayer";
import { useModal } from "../../hooks/useModal";
import { AddFriendsModal } from "./AddFriendsModal";
import { isTemplate } from "../constants";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import FontAwesome5Icon from "react-native-vector-icons/FontAwesome5";

// The button component can definitely be abstracted here

export const AddDetails = ({
  item,
  updateItem,
  notification,
  updateNotify,
  setDescOpen,
  descOpen,
  setLinkOpen,
  linkOpen,
  invited,
  noteItem = false,
}) => {
  const { enabled } = useNotifications();
  const { updateModal } = useModal();
  return (
    <View style={styles.mainContainer}>
      <View style={styles.detailsListWrapper}>
        {!noteItem && (
          <TouchableHighlight
            style={styles.addFieldContainer}
            underlayColor={"rgba(0,0,0,0.5)"}
            onPress={() => {
              if (invited) return;
              updateModal(<AddFriendsModal item_id={item.id} />);
            }}
          >
            <View style={styles.addFieldContent}>
              {/* 
                // @ts-ignore */}
              <FontAwesome5Icon name="users" color={"white"} size={16} />
              <Text style={styles.addFieldText}>Add Friends +</Text>
            </View>
          </TouchableHighlight>
        )}
        {!item.date && !isTemplate(item) && (
          <TouchableHighlight
            style={styles.addFieldContainer}
            underlayColor={"rgba(0,0,0,0.5)"}
            onPress={() => {
              if (invited) return;
              updateItem({ ...item, date: formatDateData(new Date()) });
            }}
          >
            <View style={styles.addFieldContent}>
              {/* 
                // @ts-ignore */}
              <MaterialIcons name="date-range" color={"white"} size={18} />
              <Text style={styles.addFieldText}>Add Date +</Text>
            </View>
          </TouchableHighlight>
        )}
        {!item.time && (
          <TouchableHighlight
            style={styles.addFieldContainer}
            underlayColor={"rgba(0,0,0,0.5)"}
            onPress={() => {
              if (invited) return;
              updateItem({ ...item, time: "09:00" });
            }}
          >
            <View style={styles.addFieldContent}>
              {/* 
                // @ts-ignore */}
              <MaterialIcons name="access-time" color={"white"} size={18} />
              <Text style={styles.addFieldText}>Add Time +</Text>
            </View>
          </TouchableHighlight>
        )}
        {!notification && !noteItem && (
          <TouchableHighlight
            style={styles.addNotificationContainer}
            underlayColor={"rgba(0,0,0,0.5)"}
            onPress={() => {
              if (invited) return;
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
            <View style={styles.addFieldContent}>
              {/* 
                // @ts-ignore */}
              <MaterialIcons
                name="notifications-active"
                color={"white"}
                size={18}
              />
              <Text style={styles.addNotificationText}>Add Reminder +</Text>
            </View>
          </TouchableHighlight>
        )}
        {!linkOpen && (
          <TouchableHighlight
            style={styles.addFieldContainer}
            underlayColor={"rgba(0,0,0,0.5)"}
            onPress={() => {
              if (invited) return;
              setLinkOpen(true);
              updateItem({ ...item, url: "" });
            }}
          >
            <View style={styles.addFieldContent}>
              {/* 
               // @ts-ignore */}
              <MaterialIcons name="link" color={"white"} size={18} />
              <Text style={styles.addFieldText}>Add Link +</Text>
            </View>
          </TouchableHighlight>
        )}
        {!descOpen && (
          <TouchableHighlight
            style={styles.addFieldContainer}
            underlayColor={"rgba(0,0,0,0.5)"}
            onPress={() => {
              if (invited) return;
              setDescOpen(true);
              updateItem({ ...item, desc: "" });
            }}
          >
            <View style={styles.addFieldContent}>
              {/* 
               // @ts-ignore */}
              <MaterialIcons name="edit" color={"white"} size={18} />
              <Text style={styles.addFieldText}>Add Description +</Text>
            </View>
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
  addFieldContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
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
