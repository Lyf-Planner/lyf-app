import { useEffect, useState } from 'react';
import { StyleSheet, Text, View, TouchableHighlight } from 'react-native';

import AntDesign from 'react-native-vector-icons/AntDesign';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

import { UserFriendsList } from './UserFriendsList';

import { FriendAction } from '@/components/FriendActions';
import { Loader } from '@/components/Loader';
import { getUser } from '@/rest/user';
import { ID } from '@/schema/database/abstract';
import { UserFriend } from '@/schema/user';
import { useModal } from '@/shell/useModal';
import { black, blackWithOpacity, white } from '@/utils/colours';
import { localisedMoment } from '@/utils/dates';

type Props = {
  user_id: ID
}

export const UserModal = ({ user_id }: Props) => {
  const [user, setUser] = useState<UserFriend>();
  const [friendsListOpen, setFriendsListOpen] = useState(false);
  const { updateModal } = useModal();

  useEffect(() => {
    if (!user) {
      getUser(user_id, 'users').then((res) => setUser(res));
    }
  }, [user_id]);

  let body = (
    <View style={styles.loaderContainer}>
      <Loader />
    </View>
  )

  if (user?.relations?.users && friendsListOpen) {
    body = (
      <View style={styles.openUserListContainer}>
        <UserFriendsList
          open={friendsListOpen}
          setOpen={setFriendsListOpen}
          friends={user.relations.users}
          maxHeight={285}
        />
      </View>
    )
  } else if (user) {
    body = (
      <View style={styles.columnContainer}>
        <View style={styles.userDetails}>
          <FontAwesome name="user" size={50} />
          <View style={styles.bothNames}>
            <Text style={styles.mainAliasText}>{user.display_name || user.id}</Text>
            <Text style={styles.subAliasText}>{user.id}</Text>
          </View>
        </View>

        <View style={styles.fieldSectionWrapper}>
          <UserDetailField
            title="Joined"
            value={localisedMoment(user.created).format('MMM D YYYY')}
          />
          <UserDetailField
            title="Last Active"
            value={localisedMoment(user.last_updated).format('MMM D YYYY')}
          />
        </View>

        {user.relations?.users && user.relations?.users.length > 0 &&
          <UserFriendsList
            open={friendsListOpen}
            setOpen={setFriendsListOpen}
            friends={user.relations.users}
            maxHeight={50}
          />
        }

        <View style={styles.actionButton}>
          <FriendAction friend={user} height={50} />
        </View>
      </View>
    )
  }

  const conditionalStyles = {
    mainContainer: {
      height: friendsListOpen ? 350 : 300
    }
  }

  return (
    <View style={[styles.mainContainer, conditionalStyles.mainContainer]} key={user_id}>
      <TouchableHighlight
        style={styles.closeButton}
        onPress={() => updateModal(undefined)}
        underlayColor={'rgba(0,0,0,0.5)'}
      >
        <AntDesign name="close" color="rgba(0,0,0,0.5)" size={18} />
      </TouchableHighlight>

      {body}
    </View>
  );
};

type DetailsProps = {
  title: string,
  value: string
}

export const UserDetailField = ({ title, value }: DetailsProps) => {
  return (
    <View style={styles.fieldWrapper}>
      <Text style={styles.fieldNameText}>
        {title}
      </Text>
      <Text style={styles.fieldValueText}>{value}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  actionButton: {
    borderRadius: 8,
    height: 50,
    shadowColor: black,

    shadowOffset: { width: 1, height: 1 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    width: '100%'
  },
  bothNames: { alignItems: 'flex-start', flexDirection: 'column', gap: 2, justifyContent: 'center' },
  closeButton: {
    borderRadius: 8,
    padding: 4,
    position: 'absolute',
    right: 8,
    top: 8
  },
  columnContainer: {
    alignItems: 'center',
    flex: 1,
    flexDirection: 'column',
    gap: 14,
    justifyContent: 'center',
    overflow: 'visible',
    paddingHorizontal: 10
  },
  fieldNameText: {
    fontFamily: 'Lexend',
    fontSize: 16,
    opacity: 0.6
  },
  fieldSectionWrapper: { gap: 4, paddingHorizontal: 8, width: '100%' },
  fieldValueText: { fontSize: 16, marginLeft: 'auto', marginRight: 8, opacity: 0.4 },

  fieldWrapper: { flexDirection: 'row', justifyContent: 'flex-start', width: '100%' },

  loaderContainer: {
    alignItems: 'center',
    flexDirection: 'row',
    flex: 1,
    justifyContent: 'center'
  },
  mainAliasText: { fontFamily: 'Lexend', fontSize: 22 },
  mainContainer: {
    backgroundColor: white,
    borderColor: blackWithOpacity(0.5),
    borderRadius: 10,
    borderWidth: 1,
    maxWidth: 425,

    paddingHorizontal: 15,
    paddingVertical: 25,
    shadowColor: black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 10,
    width: '95%'
  },
  openUserListContainer: {
    height: 300,
    paddingVertical: 18
  },
  subAliasText: { color: blackWithOpacity(0.5), fontSize: 14 },

  userDetails: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    gap: 16,
    paddingHorizontal: 8,
    width: '100%'
  }
});
