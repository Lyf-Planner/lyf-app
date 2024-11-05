import { useState } from 'react';
import { StyleSheet, View, Text, ScrollView } from 'react-native';

import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { RouteParams } from 'Routes';

import { PageLoader } from '@/components/PageLoader';
import { UserBanner } from '@/components/UserBanner';
import { SearchHeader } from '@/containers/FriendSearchHeader';
import { PageBackground } from '@/containers/PageBackground';
import { UserList } from '@/containers/UserList'
import { useFriends } from '@/hooks/cloud/useFriends'
import { PublicUser } from '@/schema/user';

export const Friends = (props: BottomTabScreenProps<RouteParams>) => {
  const { friends, loading } = useFriends();

  const [searchedUser, setSearchedUser] = useState<PublicUser | null>();
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
              emptyText={'No friends added yet :)'}
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
  foundUserWrapper: {
    alignSelf: 'center',
    flexDirection: 'column',
    flex: 1,
    justifyContent: 'center',
    marginBottom: 10,
    maxWidth: 400,
    minHeight: 50,
    width: '100%'
  },
  hintText: {
    fontFamily: 'Lexend',
    fontSize: 18,
    marginVertical: 18,
    opacity: 0.5,
    textAlign: 'center',
    width: '100%'
  },

  main: {
    flex: 1,
    flexDirection: 'column'
  },

  notFoundText: {
    fontFamily: 'Lexend',
    fontSize: 18,
    fontWeight: '500',
    marginBottom: 20,
    marginTop: 4,
    textAlign: 'center',
    width: '100%'
  },
  pageContent: {
    flexDirection: 'column',
    gap: 8,
    overflow: 'visible'
  },
  scrollContainer: {
    alignSelf: 'center',
    flexDirection: 'column',
    marginBottom: 300,
    maxWidth: 450,
    padding: 20,
    width: '100%'
  }
})
