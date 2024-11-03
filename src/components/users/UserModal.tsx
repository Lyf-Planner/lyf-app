import { StyleSheet, Text, View, TouchableHighlight, Platform } from 'react-native';
import { useEffect, useState } from 'react';
import { Loader } from '../../components/general/MiscComponents';
import { getUser } from '../../rest/user';
import { FriendAction } from '../../pages/friends/FriendActions';
import { useModal } from 'hooks/overlays/useModal';
import { localisedMoment } from '../../utils/dates';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { ID } from 'schema/database/abstract';
import { PublicUser, UserFriend } from 'schema/user';
import { eventsBadgeColor, white } from 'utils/colours';
import { UserFriendsList } from './UserFriendsList';

type Props = {
  user_id: ID
}

export const UserModal = ({ user_id }: Props) => {
  const [user, setUser] = useState<UserFriend>();
  const [friendsListOpen, setFriendsListOpen] = useState(false);
  const { updateModal } = useModal();

  useEffect(() => {
    !user && getUser(user_id, "users").then((res) => setUser(res));
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
  mainContainer: {
    width: '95%',
    maxWidth: 425,
    backgroundColor: white,
    paddingVertical: 25,
    paddingHorizontal: 15,

    borderColor: 'rgba(0,0,0,0.5)',
    borderWidth: 1,
    borderRadius: 10,
    shadowColor: 'black',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 10
  },
  closeButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    padding: 4,
    borderRadius: 8
  },
  columnContainer: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 14,
    paddingHorizontal: 10,
    overflow: 'visible',
  },
  userDetails: {
    flexDirection: 'row',
    width: '100%',
    alignItems: 'flex-start',
    gap: 16,
    paddingHorizontal: 8,
  },
  nameRow: { flexDirection: 'column', alignItems: 'center' },
  bothNames: { flexDirection: 'column', gap: 2, alignItems: 'flex-start', justifyContent: 'center' },
  header: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 4,
    marginBottom: 4
  },

  openUserListContainer: {
    paddingVertical: 18,
    height: 300,
  },

  actionButton: { 
    height: 50, 
    width: '100%',
    borderRadius: 8,

    shadowColor: 'black',
    shadowOffset: { width: 1, height: 1 },
    shadowOpacity: 0.8,
    shadowRadius: 2
  },

  mainAliasText: { fontSize: 22, fontFamily: 'Lexend' },
  subAliasText: { fontSize: 14, color: 'rgba(0,0,0,0.5)' },
  fieldSectionWrapper: { gap: 4, width: '100%', paddingHorizontal: 8 },
  fieldWrapper: { flexDirection: 'row', justifyContent: 'flex-start', width: '100%' },
  fieldNameText: {
    opacity: 0.6,
    fontSize: 16,
    fontFamily: 'Lexend'
  },
  fieldValueText: { opacity: 0.4, fontSize: 16, marginLeft: 'auto', marginRight: 8, },

  loaderContainer: {
    flexDirection: 'row',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  }
});
