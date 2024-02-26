import { useEffect, useState } from "react";
import { getUsers } from "../../rest/user";
import { StyleSheet, View, Text } from "react-native";
import { UserBanner } from "./UserBanner";
import { Loader } from "../MiscComponents";
import { UserListContext } from "../../utils/constants";

export const UserList = ({
  users,
  emptyText,
  context = UserListContext.Friends,
  item = null,
}) => {
  return (
    <View style={styles.main}>
      {users ? (
        users.length ? (
          users.map((x) => (
            <UserBanner user={x} context={context} item={item} key={x.id} />
          ))
        ) : (
          <Text style={styles.emptyText}>{emptyText}</Text>
        )
      ) : (
        <Loader size={30} />
      )}
    </View>
  );
};

export const FetchUserList = ({
  users,
  emptyText,
  context = UserListContext.Friends,
  item = null,
}) => {
  const [loadedUsers, setLoadedUsers] = useState<any>(null);

  useEffect(() => {
    !loadedUsers && getUsers(users).then((res) => setLoadedUsers(res));
  }, [users]);

  return loadedUsers ? (
    <UserList
      users={loadedUsers}
      emptyText={emptyText}
      context={context}
      item={item}
    />
  ) : (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        marginVertical: 8,
      }}
    >
      <Loader />
    </View>
  );
};

const styles = StyleSheet.create({
  main: {
    flexDirection: "column",
    gap: 8,
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    minHeight: 50,
  },
  emptyText: {
    fontSize: 18,
    marginVertical: 8,
    fontFamily: "Inter",
    opacity: 0.7,
    fontWeight: "600",
  },
});
