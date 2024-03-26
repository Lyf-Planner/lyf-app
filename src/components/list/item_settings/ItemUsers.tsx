import { View, StyleSheet, Text } from "react-native";
import { UserList } from "../../users/UserList";
import { UserListContext } from "../../../utils/constants";
import { useEffect, useMemo, useState } from "react";
import { ScrollView, TouchableHighlight } from "react-native-gesture-handler";
import FontAwesome5Icon from "react-native-vector-icons/FontAwesome5";

export const ItemUsers = ({ item }) => {
  const [open, setOpen] = useState(false);
  const users = useMemo(
    () =>
      item.permitted_users.concat(item.invited_users || []).map((x) => {
        return {
          permissions: x.permissions,
          id: x.user_id,
          name: x.displayed_as,
        };
      }),
    [item]
  );

  return (
    <View style={styles.mainContainer}>
      <TouchableHighlight
        onPress={() => setOpen(!open)}
        style={styles.pressable}
        underlayColor={"rgba(0,0,0,0.5)"}
      >
        <View
          style={{
            flexDirection: "row",
            width: "100%",
            gap: 8,
            alignItems: "center",
          }}
        >
          {/* 
            // @ts-ignore */}
          <FontAwesome5Icon name="users" size={16} />
          <Text style={styles.eventText}>Users</Text>
          <Text style={[styles.subtitle, { fontSize: 16 }]}>
            ( {users.length} )
          </Text>
          {/* 
            // @ts-ignore */}
          <FontAwesome5Icon
            name={open ? "chevron-down" : "chevron-right"}
            style={{ marginLeft: "auto" }}
            size={16}
          />
        </View>
      </TouchableHighlight>

      {open && (
        <ScrollView style={styles.userList}>
          <UserList
            users={users}
            emptyText={"No users on this item :)"} // Depressing case to think about
            context={UserListContext.Item}
            item={item}
          />
        </ScrollView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flexDirection: "column",
    alignItems: "center",
  },
  pressable: { paddingRight: 10, paddingVertical: 6, borderRadius: 10 },
  eventText: { fontSize: 20, fontWeight: "500", fontFamily: "InterSemi" },
  subtitle: {
    textAlign: "center",
    opacity: 0.4,
    fontWeight: "600",
    fontSize: 15,
  },
  userList: {
    padding: 8,
    maxHeight: 300,
  },
});
