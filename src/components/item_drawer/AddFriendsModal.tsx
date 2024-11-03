import { useEffect, useMemo, useState } from 'react';
import { StyleSheet, Text, View, TouchableHighlight, Platform } from 'react-native';

import { Horizontal } from 'components/Horizontal';
import { Loader } from 'components/Loader';
import { SimpleSearch } from 'components/SimpleSearch';
import { UserList, UserListContext } from 'containers/UserList';
import { useFriends } from 'hooks/cloud/useFriends';
import { useTimetable } from 'hooks/cloud/useTimetable';
import { useModal } from 'hooks/overlays/useModal';
import { ScrollView } from 'react-native-gesture-handler';
import AntDesign from 'react-native-vector-icons/AntDesign';
import FontAwesome5Icon from 'react-native-vector-icons/FontAwesome5';
import { ID } from 'schema/database/abstract';
import { UserFriendshipStatus } from 'schema/database/user_friendships';

type Props = {
  item_id: ID,
}

export const AddFriendsModal = ({ item_id }: Props) => {
  const { friends, loading, reload } = useFriends();
  const { items } = useTimetable();
  const { updateModal } = useModal();

  const item = useMemo(() => items.find((x) => x.id === item_id), [items]);
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
        <View style={{ height: 350, paddingTop: 50, alignItems: 'center' }}>
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
  mainContainer: {
    alignContent: 'center',
    backgroundColor: white,
    borderColor: 'rgba(0,0,0,0.5)',
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
  subtitle: {
    fontSize: 15,
    fontWeight: '600',
    opacity: 0.6,
    textAlign: 'center'
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
