import { useEffect, useMemo, useState } from 'react';
import { StyleSheet, Text, View, TouchableHighlight, Platform } from 'react-native';

import { ScrollView } from 'react-native-gesture-handler';
import AntDesign from 'react-native-vector-icons/AntDesign';
import FontAwesome5Icon from 'react-native-vector-icons/FontAwesome5';

import { Horizontal } from '@/components/Horizontal';
import { Loader } from '@/components/Loader';
import { SimpleSearch } from '@/components/SimpleSearch';
import { UserList, UserListContext } from '@/containers/UserList';
import { ID } from '@/schema/database/abstract';
import { UserFriendshipStatus } from '@/schema/database/user_friendships';
import { useFriends } from '@/shell/cloud/useFriends';
import { useTimetable } from '@/shell/cloud/useTimetable';
import { useModal } from '@/shell/overlays/useModal';
import { black, blackWithOpacity, white } from '@/utils/colours';

type Props = {
  item_id: ID,
}

export const AddFriendsModal = ({ item_id }: Props) => {
  const { friends, loading, reload } = useFriends();
  const { items } = useTimetable();
  const { updateModal } = useModal();

  const item = useMemo(() => items[item_id], [items]);
  if (!item) {
    return null;
  }

  const friendsOnItem = useMemo(() => friends
    .filter((otherUser) => otherUser.status === UserFriendshipStatus.Friends)
    .map((friend) => {
      // Return the item version of the user if possible, to reflect their relation to it.
      if (item.relations?.users) {
        const itemRelatedFriend = item.relations.users.find((itemUser) => itemUser.id === friend.id);
        if (itemRelatedFriend) {
          // We add this fromModal so we can change the menu name we technically display twice
          // Really annoying package
          return { ...itemRelatedFriend, fromModal: true };
        }
      }

      return friend;
    }),
  [item, friends]);

  const [filter, setFilter] = useState('');

  useEffect(() => {
    if (loading) {
      reload();
    }
  })

  const closeModal = () => updateModal(undefined);

  return (
    <View style={styles.mainContainer}>
      <TouchableHighlight
        style={styles.touchable}
        onPress={closeModal}
        underlayColor={'rgba(0,0,0,0.5)'}
      >
        <AntDesign name="close" color="rgba(0,0,0,0.5)" size={18} />
      </TouchableHighlight>
      <View style={styles.header}>
        <FontAwesome5Icon name="user-plus" size={40} />
        <Text style={styles.title}>Invite Friends</Text>
      </View>
      <Horizontal style={styles.firstSeperator} />

      <SimpleSearch search={filter} setSearch={setFilter} />
      {loading && (
        <View style={styles.loaderWrapper}>
          <Loader />
        </View>
      )}

      {!loading && (
        <ScrollView
          style={styles.userScroll}
          contentContainerStyle={styles.scrollContainer}
          showsVerticalScrollIndicator={false}
        >
          <UserList
            users={friendsOnItem.filter((x) =>
              !filter ||
              (x.display_name && x.display_name.includes(filter)) ||
              (x.id.includes(filter))
            )}
            emptyText={'No friends added yet'}
            context={UserListContext.Item}
            item={item}
            menuContext={'in-modal'}
          />
        </ScrollView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  firstSeperator: {
    borderWidth: 2,
    marginBottom: 4,
    marginTop: 10,
    opacity: 0.25
  },
  header: {
    alignItems: 'center',
    flexDirection: 'column',
    gap: 4,
    justifyContent: 'center',
    left: 5,
    marginBottom: 4,
    position: 'relative'
  },
  loaderWrapper: { alignItems: 'center', height: 350, paddingTop: 50 },
  mainContainer: {
    alignContent: 'center',
    backgroundColor: white,
    borderColor: blackWithOpacity(0.5),
    borderRadius: 10,
    borderWidth: 1,
    flexDirection: 'column',
    gap: 10,
    height: Platform.OS === 'web' ? 450 : 'auto',
    marginHorizontal: 20,
    maxHeight: 500,
    paddingBottom: Platform.OS === 'web' ? 30 : 0,
    paddingHorizontal: 10,
    paddingTop: 30,
    shadowColor: black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 10,
    width: Platform.OS === 'web' ? 450 : 'auto'
  },
  scrollContainer: {
    alignItems: 'center',
    flexDirection: 'column',
    paddingBottom: 10
  },
  title: { fontFamily: 'Lexend', fontSize: 22, fontWeight: '700' },
  touchable: {
    borderRadius: 5,
    marginLeft: 'auto',
    padding: 4,
    position: 'absolute',
    right: 20,
    top: 20,
    zIndex: 50
  },
  userScroll: {
    maxHeight: 350,
    overflow: 'hidden',
    paddingHorizontal: 10
  }
});
