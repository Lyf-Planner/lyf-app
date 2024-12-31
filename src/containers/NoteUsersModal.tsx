import { StyleSheet, TouchableHighlight, View, Text, ScrollView, Platform } from 'react-native';

import AntDesign from 'react-native-vector-icons/AntDesign';
import FontAwesome5Icon from 'react-native-vector-icons/FontAwesome5';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import { UserList, UserListContext } from './UserList';

import { BouncyPressable } from '@/components/BouncyPressable';
import { Horizontal } from '@/components/Horizontal';
import { AddFriendsModal } from '@/containers/AddFriendsModal';
import { NoteRelatedUser } from '@/schema/notes';
import { UserRelatedNote } from '@/schema/user';
import { useRootComponentStore } from '@/store/useRootComponent';
import { black, blackWithOpacity, primaryGreen, white } from '@/utils/colours';

interface Props {
  note: UserRelatedNote;
  users: NoteRelatedUser[];
}

export const NoteUsersModal = ({ note, users }: Props) => {
  const { updateModal } = useRootComponentStore();

  const closeModal = () => updateModal(null);

  const addFriends = () => updateModal(<AddFriendsModal entity_id={note.id} type='note' />)

  return (
    <View style={styles.mainContainer}>
      <TouchableHighlight
        style={styles.touchable}
        onPress={closeModal}
        underlayColor='rgba(0,0,0,0.5)'
      >
        <AntDesign name="close" color="rgba(0,0,0,0.5)" size={18} />
      </TouchableHighlight>
      <View style={styles.header}>
        <MaterialCommunityIcons name='note-multiple' size={28} color={black} />
        <Text style={styles.title}>Note Users</Text>
      </View>
      <Horizontal style={styles.firstSeperator} />

      <ScrollView
        style={styles.userScroll}
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        <UserList
          users={users}
          emptyText={'No friends added yet'}
          context={UserListContext.Note}
          note={note}
          menuContext='note-users-modal'
        />
      </ScrollView>

      <Horizontal style={styles.firstSeperator} />

      <BouncyPressable
        containerStyle={styles.addFriendsContainer}
        onPress={() => addFriends()}
        style={styles.addFriends}
      >
        <FontAwesome5Icon name="user-plus" size={20} color={white} />
        <Text style={styles.addFriendsText}>Add Friends</Text>
      </BouncyPressable>
    </View>
  );
};

const styles = StyleSheet.create({
  addFriends: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 8,
    height: 45
  },
  addFriendsContainer: {
    backgroundColor: primaryGreen,
    borderRadius: 10,
    flexDirection: 'row',
    justifyContent: 'center',
    shadowColor: black,
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 2
  },
  addFriendsText: {
    color: white,
    fontFamily: 'Lexend',
    fontSize: 18
  },
  firstSeperator: {
    borderWidth: 2,
    marginBottom: 4,
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
    borderColor: blackWithOpacity(0.5),
    borderRadius: 10,
    borderWidth: 1,
    flexDirection: 'column',
    gap: 6,
    height: 450,
    maxHeight: 600,
    paddingBottom: Platform.OS === 'web' ? 30 : 15,
    paddingHorizontal: 15,
    paddingTop: 30,
    shadowColor: black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 10,
    width: Platform.OS === 'web' ? 450 : 375
  },
  scrollContainer: {
    alignItems: 'center',
    flexDirection: 'column'
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
    paddingHorizontal: 8
  }
});

