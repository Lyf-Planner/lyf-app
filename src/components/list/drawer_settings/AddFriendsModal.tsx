import { StyleSheet, Text, View, TouchableHighlight } from 'react-native';
import { useModal } from 'providers/overlays/useModal';
import { useAuth } from 'providers/cloud/useAuth';
import { useEffect, useMemo, useState } from 'react';
import { Horizontal, Loader } from '../../general/MiscComponents';
import { SimpleSearch } from '../../fields/SimpleSearch';
import { ScrollView } from 'react-native-gesture-handler';
import FontAwesome5Icon from 'react-native-vector-icons/FontAwesome5';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { ID } from 'schema/database/abstract';
import { useFriends } from 'providers/cloud/useFriends';
import { UserList, UserListContext } from 'components/users/UserList';
import { LocalItem } from 'schema/items';
import { useTimetable } from 'providers/cloud/useTimetable';

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

  const friendsOnItem = useMemo(() => friends.map((friend) => {
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
  }), [item, friends])

  const [filter, setFilter] = useState(null);

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
        <ScrollView style={styles.userScroll} contentContainerStyle={styles.scrollContainer}>
          <UserList 
            users={friendsOnItem} 
            emptyText={''}
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
  mainContainer: {
    backgroundColor: 'white',
    paddingHorizontal: 20,
    marginHorizontal: 20,
    paddingTop: 30,
    borderColor: 'rgba(0,0,0,0.5)',
    borderWidth: 1,
    borderRadius: 10,
    gap: 10,
    shadowColor: 'black',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 10,
    flexDirection: 'column',
    alignContent: 'center'
  },
  touchable: { 
    marginLeft: 'auto', 
    position: 'absolute',
    zIndex: 50,
    top: 20,
    right: 20,
    borderRadius: 5,
    padding: 4,
  },
  header: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 4,
    marginBottom: 4,
    position: 'relative',
    left: 5,
  },
  firstSeperator: {
    opacity: 0.25,
    marginTop: 10,
    marginBottom: 4,
    borderWidth: 2
  },
  userScroll: { 
    maxHeight: 350, 
    overflow: 'visible',
  },
  scrollContainer: {
    flexDirection: 'column',
    alignItems: 'center',
  },
  title: { fontSize: 22, fontWeight: '700' },
  subtitle: {
    textAlign: 'center',
    opacity: 0.6,
    fontWeight: '600',
    fontSize: 15
  }
});
