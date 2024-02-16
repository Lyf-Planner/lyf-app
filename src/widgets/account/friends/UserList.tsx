import { useEffect, useState } from "react";
import { getUsers } from "../../../rest/user";
import { StyleSheet, View, Text } from "react-native";
import { UserBanner } from "./UserBanner";
import { Loader } from "../../../components/MiscComponents";

export const UserList = ({ users, emptyText }) => {
  const [loadedUsers, setLoadedUsers] = useState<any>(null);

  useEffect(() => {
    !loadedUsers && getUsers(users).then((res) => setLoadedUsers(res));
  }, [users]);

  return (
    <View style={styles.main}>
      {loadedUsers ? (
        loadedUsers.length ? (
          loadedUsers.map((x) => <UserBanner user={x} />)
        ) : (
          <Text style={styles.emptyText}>{emptyText}</Text>
        )
      ) : (
        <Loader size={30} />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  main: {
    flexDirection: "column",
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
