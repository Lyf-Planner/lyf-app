import { StyleSheet, Text, View } from "react-native";
import { eventsBadgeColor } from "../../utils/constants";
import { FriendAction } from "../../pages/account/friends/FriendActions";
import { BouncyPressable } from "../pressables/BouncyPressable";
import { UserListContext } from "../../utils/constants";
import { ItemSocialAction } from "../list/item_settings/ItemSocialAction";
import { useModal } from "../../hooks/useModal";
import { UserModal } from "./UserModal";
import FontAwesome from "react-native-vector-icons/FontAwesome";

export const UserBanner = ({
  user,
  context = UserListContext.Friends,
  item = null,
}) => {
  const { updateModal } = useModal();

  return (
    <BouncyPressable
      style={styles.main}
      onPress={() => updateModal(<UserModal user_id={user.id} />)}
    >
      <FontAwesome name="user" size={24} />
      {user.name && user.name !== user.id ? (
        <View style={styles.nameRow}>
          <Text
            numberOfLines={1}
            adjustsFontSizeToFit
            style={styles.mainAliasText}
          >
            {user.name}
          </Text>
          <Text
            adjustsFontSizeToFit
            numberOfLines={1}
            style={styles.subAliasText}
          >
            {user.id}
          </Text>
        </View>
      ) : (
        <Text
          adjustsFontSizeToFit
          numberOfLines={1}
          style={styles.mainAliasText}
        >
          {user.id}
        </Text>
      )}

      <View style={styles.actionWrapper}>
        {context === UserListContext.Friends ? (
          <FriendAction user_id={user.id} />
        ) : (
          <ItemSocialAction user_id={user.id} item={item} />
        )}
      </View>
    </BouncyPressable>
  );
};

const styles = StyleSheet.create({
  main: {
    flexDirection: "row",
    width: "100%",
    alignItems: "center",
    height: 70,
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: eventsBadgeColor,
    borderRadius: 10,

    shadowColor: "black",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 3,
  },
  nameRow: { flexDirection: "column", gap: 2, width: "55%" },
  actionWrapper: {
    marginLeft: "auto",
    width: 110,
    shadowColor: "black",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 1,
  },
  mainAliasText: { fontSize: 22, fontWeight: "500" },
  subAliasText: { fontSize: 14, color: "rgba(0,0,0,0.5)" },
});
