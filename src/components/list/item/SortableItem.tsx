import { StyleSheet, View, Text, Pressable } from "react-native";
import { ITEM_STATUS_TO_COLOR, ItemStatus, ListItemType } from "../constants";
import { TwentyFourHourToAMPM } from "../../../utils/dates";
import { deepBlue, primaryGreen } from "../../../utils/constants";
import { Vertical } from "../../general/MiscComponents";
import AntDesign from "react-native-vector-icons/AntDesign";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import Feather from "react-native-vector-icons/Feather";
import { useMemo } from "react";
import { useAuth } from "../../../authorisation/AuthProvider";

export const SortableItem = ({
  item,
  badgeColor,
  badgeTextColor,
  dragFunc = null,
  isActive = false,
}) => {
  const { user } = useAuth();
  const invited = useMemo(
    () =>
      item?.invited_users &&
      !!item.invited_users.find((x) => x.user_id === user.id),
    [item.invited_users, user]
  );

  // STYLING

  const determineBadgeColor = () => {
    if (!item.status || item.status === ItemStatus.Upcoming) return badgeColor;
    else return ITEM_STATUS_TO_COLOR[item.status];
  };

  const determineBadgeTextColor = () => {
    if (item.status === ItemStatus.Done) return "white";
    if (item.status === ItemStatus.InProgress) return "black";
    if (item.status === ItemStatus.Tentative) return "black";
    if (item.status === ItemStatus.Cancelled) return "black";
    else return badgeTextColor;
  };

  const getTimeText = () => {
    if (item.end_time && item.time) {
      const amPmSlicePosition = -2;

      const potentialTime = TwentyFourHourToAMPM(item.time);
      const endTime = TwentyFourHourToAMPM(item.end_time);

      // Remove AMPM from time to save space, if it's the same as the end time
      const sameAMPM =
        potentialTime.slice(amPmSlicePosition) ===
        endTime.slice(amPmSlicePosition);
      const time = sameAMPM
        ? TwentyFourHourToAMPM(item.time, false)
        : potentialTime;

      return time + "-" + endTime;
    } else if (item.time) {
      const time = TwentyFourHourToAMPM(item.time);
      return time;
    } else return;
  };

  const conditionalStyles = {
    listItem: {
      backgroundColor: determineBadgeColor(),
      borderRadius: item.type !== ListItemType.Task ? 5 : 15,
      opacity: item.status === ItemStatus.Cancelled || invited ? 0.7 : 1,
    },
    checkCircle: { color: determineBadgeTextColor() },
    listItemText: {
      color: determineBadgeTextColor(),
      fontFamily: item.type !== ListItemType.Task ? "InterMed" : "Inter",
    },
    collaborativeIndicator: {
      backgroundColor: item.status === ItemStatus.Done ? "white" : primaryGreen,
    },
    sortableIndicator: {
      backgroundColor: determineBadgeTextColor(),
    },
  };

  return (
    <View style={[styles.listItem, conditionalStyles.listItem]}>
      <View>
        {/* 
             // @ts-ignore */}
        <AntDesign
          name={
            item.status === ItemStatus.Done ? "checkcircle" : "checkcircleo"
          }
          style={conditionalStyles.checkCircle}
          size={18}
        />
      </View>

      <Text
        adjustsFontSizeToFit={true}
        numberOfLines={2}
        style={[styles.listItemText, conditionalStyles.listItemText]}
      >
        {item.title}
        {item.location && ` @ ${item.location}`}
      </Text>

      {item.time && (
        <View style={styles.listItemTimeSection}>
          <Vertical style={styles.diagLines} />
          <Text
            adjustsFontSizeToFit={true}
            numberOfLines={1}
            style={[
              styles.listItemTimeText,
              {
                color: determineBadgeTextColor(),
                fontFamily:
                  item.type !== ListItemType.Task ? "InterMed" : "Inter",
              },
            ]}
          >
            {getTimeText()}
          </Text>
        </View>
      )}

      {(item.permitted_users.length > 1 || item.invited_users?.length > 0) && (
        <View
          style={[
            styles.collaborativeIndicator,
            conditionalStyles.collaborativeIndicator,
          ]}
        >
          {/* 
                // @ts-ignore */}
          <FontAwesome5
            name="users"
            size={16}
            color={item.status === ItemStatus.Done ? primaryGreen : "white"}
          />
        </View>
      )}

      {!invited && (
        <Pressable
          disabled={isActive}
          onPressIn={() => dragFunc()}
          onLongPress={() => dragFunc()}
          style={[
            styles.sortableIndicator,
            conditionalStyles.sortableIndicator,
          ]}
        >
          {/* 
                // @ts-ignore */}
          <Feather
            name="menu"
            size={16}
            color={item.status === ItemStatus.Done ? primaryGreen : "white"}
          />
        </Pressable>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  listItem: {
    flexDirection: "row",
    width: "100%",
    padding: 10,
    flex: 1,
    height: 55,
    borderWidth: 1,
    gap: 4,
    alignItems: "center",
  },
  listItemText: {
    fontSize: 17,
    padding: 2,
    flex: 1,
  },
  listItemTimeSection: {
    minWidth: "30%",
    flexDirection: "row",
    height: "100%",
    alignItems: "center",
    marginLeft: "auto",
    justifyContent: "flex-end",
  },
  listItemTimeText: {
    padding: 2,
    marginLeft: 12,
  },
  diagLines: {
    borderColor: deepBlue,
    opacity: 0.2,
    marginLeft: 8,
    height: "200%",
    borderLeftWidth: 2,
    transform: [{ rotateZ: "-20deg" }],
  },

  collaborativeIndicator: {
    borderRadius: 30,
    aspectRatio: 1,
    width: "10%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  sortableIndicator: {
    borderRadius: 30,
    aspectRatio: 1,
    width: "10%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  inviteIndicator: {
    borderRadius: 50,
    aspectRatio: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 6,
  },
});
