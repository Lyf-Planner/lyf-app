import { StyleSheet, Text, View, TouchableHighlight } from 'react-native';
import { useEffect, useState } from 'react';
import { Loader } from '../../components/general/MiscComponents';
import { getUser } from '../../rest/user';
import { FriendAction } from '../../pages/friends/FriendActions';
import { useModal } from 'providers/overlays/useModal';
import { localisedMoment } from '../../utils/dates';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { ID } from 'schema/database/abstract';
import { PublicUser, UserFriend } from 'schema/user';

type Props = {
  user_id: ID
}

export const UserModal = ({ user_id }: Props) => {
  const [user, setUser] = useState<UserFriend>();
  const { updateModal } = useModal();

  useEffect(() => {
    !user && getUser(user_id, "users").then((res) => setUser(res));
  }, [user_id]);

  return (
    <View style={styles.mainContainer}>
      {user ? (
        <View style={styles.columnContainer}>
          <TouchableHighlight
            style={styles.closeButton}
            onPress={() => updateModal(undefined)}
            underlayColor={'rgba(0,0,0,0.5)'}
          >
            <AntDesign name="close" color="rgba(0,0,0,0.5)" size={18} />
          </TouchableHighlight>
          <FontAwesome name="user" size={50} />
          <View style={styles.nameRow}>
            <View style={styles.bothNames}>
              {user.display_name && <Text style={styles.mainAliasText}>{user.display_name}</Text>}
              <Text style={user.display_name ? styles.subAliasText : styles.mainAliasText}>{user.id}</Text>
            </View>
          </View>

          <View style={{ height: 50 }}>
            <FriendAction friend={user} />
          </View>

          <View style={styles.fieldSectionWrapper}>
            <UserDetailField
              title="Last Active"
              value={localisedMoment(user.last_updated).format('MMM D YYYY')}
            />
            <UserDetailField
              title="Joined"
              value={localisedMoment(user.created).format('MMM D YYYY')}
            />
          </View>
        </View>
      ) : (
        <Loader />
      )}
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
        {' > '}
      </Text>
      <Text style={styles.fieldValueText}>{value}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    width: 300,
    height: 400,
    backgroundColor: 'white',
    padding: 25,

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
    top: -4,
    right: 0,
    padding: 4,
    borderRadius: 8
  },
  columnContainer: {
    flex: 1,
    flexDirection: 'column',

  },
  nameRow: { flexDirection: 'row', alignItems: 'center' },
  bothNames: { flexDirection: 'column', gap: 4, alignItems: 'center' },
  header: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 4,
    marginBottom: 4
  },
  firstSeperator: {
    opacity: 0.25,
    marginTop: 10,
    width: '100%',
    marginBottom: 4,
    borderWidth: 2
  },
  title: { fontSize: 22, fontWeight: '700' },
  subtitle: {
    textAlign: 'center',
    opacity: 0.6,
    fontWeight: '600',
    fontSize: 15
  },
  mainAliasText: { fontSize: 22, fontWeight: '500' },
  subAliasText: { fontSize: 14, color: 'rgba(0,0,0,0.5)' },
  fieldSectionWrapper: { gap: 6, marginTop: 8 },
  fieldWrapper: { flexDirection: 'row', justifyContent: 'flex-start' },
  fieldNameText: {
    opacity: 0.6,
    fontWeight: '600',
    fontSize: 16
  },
  fieldValueText: { opacity: 0.4, fontSize: 16 }
});
