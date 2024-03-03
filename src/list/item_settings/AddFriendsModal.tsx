import { StyleSheet, Text, View, TouchableHighlight } from "react-native";
import { useModal } from "../../hooks/useModal";
import { useAuth } from "../../authorisation/AuthProvider";
import { useMemo, useState } from "react";
import { Horizontal } from "../../components/MiscComponents";
import { FetchUserList } from "../../components/users/UserList";
import { UserListContext } from "../../utils/constants";
import { SimpleSearch } from "../../components/SimpleSearch";
import { ScrollView } from "react-native-gesture-handler";
import { useItems } from "../../hooks/useItems";
import FontAwesome5Icon from "react-native-vector-icons/FontAwesome5";
import AntDesign from "react-native-vector-icons/AntDesign";

export const AddFriendsModal = ({ item_id }) => {
  const { user } = useAuth();
  const { items } = useItems();
  const { updateModal } = useModal();

  const [filter, setFilter] = useState(null);
  const item = useMemo(
    () => items.find((x) => x.id === item_id),
    [items, item_id]
  );

  const closeModal = () => updateModal(null);

  return (
    <View style={styles.mainContainer}>
      <TouchableHighlight
        style={{ marginLeft: "auto", padding: 4, borderRadius: 5 }}
        onPress={closeModal}
        underlayColor={"rgba(0,0,0,0.5)"}
      >
        {/* 
          // @ts-ignore */}
        <AntDesign name="close" color="rgba(0,0,0,0.5)" size={18} />
      </TouchableHighlight>
      <View style={{ gap: 2 }}>
        <View style={styles.header}>
          {/* 
            // @ts-ignore */}
          <FontAwesome5Icon name="user-plus" size={40} />
          <Text style={styles.title}>Invite Friends</Text>
        </View>
      </View>
      <Horizontal style={styles.firstSeperator} />
      <SimpleSearch search={filter} setSearch={setFilter} />
      <ScrollView style={{ maxHeight: 250, padding: 4 }}>
        <FetchUserList
          users={user.social.friends}
          emptyText={
            filter
              ? "No friends match this search :)"
              : "Add friends from your profile page :)"
          }
          context={UserListContext.Item}
          item={item}
        />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    backgroundColor: "white",
    paddingHorizontal: 20,
    paddingTop: 20,
    marginHorizontal: 20,
    borderColor: "rgba(0,0,0,0.5)",
    borderWidth: 1,
    borderRadius: 10,
    gap: 10,
    shadowColor: "black",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 10,
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
    marginTop: 10,
    marginBottom: 4,
    borderWidth: 2,
  },
  title: { fontSize: 22, fontWeight: "700" },
  subtitle: {
    textAlign: "center",
    opacity: 0.6,
    fontWeight: "600",
    fontSize: 15,
  },
});
