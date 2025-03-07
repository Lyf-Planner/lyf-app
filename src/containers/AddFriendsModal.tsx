import { useMemo, useState } from 'react';
import { StyleSheet, Text, View, TouchableHighlight, Platform } from 'react-native';

import { ScrollView } from 'react-native-gesture-handler';
import AntDesign from 'react-native-vector-icons/AntDesign';
import FontAwesome5Icon from 'react-native-vector-icons/FontAwesome5';

import { Loader } from '@/components/Loader';
import { SimpleSearch } from '@/components/SimpleSearch';
import { UserList, UserListContext } from '@/containers/UserList';
import { ID } from '@/schema/database/abstract';
import { UserFriendshipStatus } from '@/schema/database/user_friendships';
import { LocalItem } from '@/schema/items';
import { UserRelatedNote } from '@/schema/user';
import { useFriendsStore } from '@/store/useFriendsStore';
import { useNoteStore } from '@/store/useNoteStore';
import { useRootComponentStore } from '@/store/useRootComponent';
import { useTimetableStore } from '@/store/useTimetableStore';
import { black, blackWithOpacity, white } from '@/utils/colours';
import { SocialEntityType } from '@/utils/misc';

type Props = {
  entity_id: ID,
  type: SocialEntityType
}

export const AddFriendsModal = ({ entity_id, type }: Props) => {
  const { friends, loading } = useFriendsStore();
  const { items } = useTimetableStore();
  const { notes } = useNoteStore();
  const { updateModal } = useRootComponentStore();

  const [filter, setFilter] = useState('');

  const entity = useMemo(() => {
    if (type === 'item') {
      return items[entity_id];
    }

    if (type === 'note') {
      return notes[entity_id];
    }
  }, [items, notes]);

  if (!entity) {
    return null;
  }

  const friendsOnEntity = useMemo(() => friends
    .filter((otherUser) => otherUser.status === UserFriendshipStatus.Friends)
    .map((friend) => {
      // Return the item version of the user if possible, to reflect their relation to it.
      if (entity.relations?.users) {
        const itemRelatedFriend = entity.relations.users.find((entityUser) => entityUser.id === friend.id);
        if (itemRelatedFriend) {
          // We add this fromModal so we can change the menu name we technically display twice
          // Really annoying package
          return { ...itemRelatedFriend, fromModal: true };
        }
      }

      return friend;
    }),
  [entity, friends]);

  const closeModal = () => updateModal(null);

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
            users={friendsOnEntity.filter((x) =>
              !filter ||
              (x.display_name && x.display_name.includes(filter)) ||
              (x.id.includes(filter))
            )}
            emptyText={'No friends added yet'}
            context={type === 'item' ? UserListContext.Item : UserListContext.Note}
            item={type === 'item' ? entity as LocalItem : undefined}
            note={type === 'note' ? entity as UserRelatedNote : undefined}
          />
        </ScrollView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
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
    gap: 6,
    height: 450,
    maxHeight: 600,
    paddingBottom: Platform.OS === 'web' ? 30 : 0,
    paddingHorizontal: 15,
    paddingVertical: 30,
    shadowColor: black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 10,
    width: Platform.OS === 'web' ? 450 : 375
  },
  scrollContainer: {
    paddingBottom: 100
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
    padding: 8
  }
});
