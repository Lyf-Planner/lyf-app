import { UserList } from "containers/UserList"
import { useFriends } from "hooks/cloud/useFriends"
import { useState } from 'react';
import { StyleSheet, View, Text, ScrollView } from 'react-native';
import { PageLoader } from 'components/PageLoader';
import { UserBanner } from 'components/UserBanner';
import { SearchHeader } from "containers/FriendSearchHeader";
import { PageBackground } from "containers/PageBackground";
import { BottomTabScreenProps } from "@react-navigation/bottom-tabs";
import { RouteParams } from "Routes";

export const Friends = (props: BottomTabScreenProps<RouteParams>) => {
  const { friends, loading } = useFriends();

  const [searchedUser, setSearchedUser] = useState<any>();
  const [searched, setSearched] = useState(false);

  return (
    <View style={styles.main}>
      <SearchHeader 
        searched={searched}
        setSearched={setSearched}
        setSearchedUser={setSearchedUser}
      />

    <PageBackground noPadding>
      <ScrollView style={styles.pageContent}>
        <View style={styles.scrollContainer}>
          {searched && 
            <Text style={styles.notFoundText}>
              Not found
            </Text>
          }
          {searchedUser && 
            <View style={styles.foundUserWrapper}>
              <UserBanner 
                user={searchedUser} 
                // We clear the searched user whenever any action is made (to any user!)
                // As the user we action may not be in the friends store
                // - Update will simply modify the friends store, showing the user via the friends list instead of this
                // - Addition will remove searched user, add to the user list via friends
                // - Removal will clear this and the duplicate in the user list
                callback={() => setSearchedUser(null)} 
              />
            </View>
          }
          
          {!loading && 
            <UserList 
              users={friends.filter((x) => x.id !== searchedUser?.id)} 
              emptyText={"No friends added yet :)"}
              callback={() => setSearchedUser(null)}
            />
          }
          {!loading && 
            <Text style={styles.hintText}>Ask your friends for their usernames!</Text>
          }

          {loading &&
            <PageLoader />
          }
          </View>
        </ScrollView>
      </PageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  main: {
    flex: 1,
    flexDirection: 'column',
  },
  scrollContainer: {
    alignSelf: 'center',
    flexDirection: "column",
    maxWidth: 450,
    width: '100%',
    marginBottom: 300,
    padding: 20,
  },

  pageContent: {
    flexDirection: 'column',
    gap: 8,
    overflow: 'visible',
  },
  foundUserWrapper: { 
    marginBottom: 10,
    flexDirection: 'column',
    justifyContent: 'center',
    flex: 1,
    width: '100%',
    maxWidth: 400,
    minHeight: 50,
    alignSelf: 'center'
  },

  loaderWrapper: { marginLeft: 'auto', marginRight: 8 },
  notFoundText: {
    fontSize: 18,
    fontWeight: '500',
    fontFamily: 'Lexend',
    width: '100%',
    marginTop: 4,
    marginBottom: 20,
    textAlign: 'center'
  },
  hintText: {
    width: '100%',
    textAlign: 'center',
    fontSize: 18,
    marginVertical: 18,
    fontFamily: 'Lexend',
    opacity: 0.5,
  }
})