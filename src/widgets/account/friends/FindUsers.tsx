import { useEffect, useRef, useState } from "react";
import { Pressable, StyleSheet, View, Text } from "react-native";
import { TextInput } from "react-native-gesture-handler";
import { Loader } from "../../../components/MiscComponents";
import { getUser } from "../../../rest/user";
import { UserBanner } from "../../../components/users/UserBanner";
import { primaryGreen } from "../../../utils/constants";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import { UserListContext } from "../../../utils/constants";

export const FindUsers = () => {
  const [retrievedUser, updateRetrievedUser] = useState<any>();
  const [searching, updateSearching] = useState(false);
  const [searched, updateSearched] = useState(false);
  const [username, updateUsername] = useState("");
  let textRef = useRef<any>();

  const findUser = async () => {
    updateSearching(true);
    let user = await getUser(username);
    if (!user) updateSearched(true);
    updateRetrievedUser(user);
    updateSearching(false);
  };

  useEffect(() => {
    // If the username changes, we cannot say we searched
    searched && updateSearched(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [username]);

  return (
    <View style={styles.main}>
      <Pressable
        style={styles.searchBarPressable}
        onPress={() => textRef.current.focus()}
      >
        <FontAwesome name="search" color="white" size={20} />
        <TextInput
          ref={textRef}
          value={username}
          selectionColor={"white"}
          style={styles.searchInput}
          onChangeText={updateUsername}
          onSubmitEditing={findUser}
          autoCapitalize="none"
          autoComplete="off"
          autoCorrect={false}
        />
        {searching && (
          <View style={styles.loaderWrapper}>
            <Loader size={25} color="white" />
          </View>
        )}
        {searched && <Text style={styles.notFoundText}>Not found</Text>}
      </Pressable>
      {retrievedUser && (
        <UserBanner user={retrievedUser} context={UserListContext.Item} />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  main: { flexDirection: "column", gap: 8 },
  searchBarPressable: {
    flexDirection: "row",
    backgroundColor: primaryGreen,
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
    alignItems: "center",
    gap: 4,
    marginHorizontal: 4,
  },
  searchInput: { padding: 4, color: "white", fontSize: 22 },
  loaderWrapper: { marginLeft: "auto", marginRight: 8 },
  notFoundText: {
    color: "white",
    fontSize: 16,
    marginLeft: "auto",
    marginRight: 4,
  },
});
