import { StyleSheet, View } from "react-native"
import { FriendSearch } from "pages/friends/containers/FriendSearch"
import { UserList } from "components/users/UserList"
import { useFriends } from "providers/cloud/useFriends"
import { useEffect } from "react"
import { PageLoader } from "components/general/MiscComponents"

export const Friends = () => {
  const { friends, loading, reload } = useFriends();

  useEffect(() => {
    if (loading) {
      reload();
    }
  })
  
  return (
    <View style={styles.main}>
      <FriendSearch />
      {loading && <PageLoader />}
      <UserList 
        users={friends} 
        emptyText={"No friends added yet... 😎"}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  main: {
    backgroundColor: "#EEE",
    flex: 1,
    padding: 12,
    flexDirection: 'column',
    gap: 12,
  },
})