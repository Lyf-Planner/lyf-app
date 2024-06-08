import { StyleSheet, Text, View, TouchableHighlight } from 'react-native';
import { useEffect, useState } from 'react';
import { Loader } from '../../components/general/MiscComponents';
import { getUser } from '../../rest/user';
import { FriendAction } from '../../pages/account/friends/FriendActions';
import { useModal } from '../../providers/useModal';
import { localisedMoment } from '../../utils/dates';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import AntDesign from 'react-native-vector-icons/AntDesign';

export const UserModal = ({ user_id }) => {
  const [user, setUser] = useState<any>(null);
  const { updateModal } = useModal();

  useEffect(() => {
    !user && getUser(user_id).then((res) => setUser(res));
  }, [user_id]);

  return (
    <View style={styles.mainContainer}>
      {user ? (
        <View style={styles.columnContainer}>
          <TouchableHighlight
            style={styles.closeButton}
            onPress={() => updateModal(null)}
            underlayColor={'rgba(0,0,0,0.5)'}
          >
            <AntDesign name="close" color="rgba(0,0,0,0.5)" size={18} />
          </TouchableHighlight>
          <FontAwesome name="user" size={50} />
          <View style={styles.nameRow}>
            {user.name ? (
              <View style={styles.bothNames}>
                <Text style={styles.mainAliasText}>{user.name}</Text>
                <Text style={styles.subAliasText}>{user.id}</Text>
              </View>
            ) : (
              <Text style={styles.mainAliasText}>{user.id}</Text>
            )}
          </View>

          <View style={{ height: 50 }}>
            <FriendAction user_id={user.id} />
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

export const UserDetailField = ({ title, value }) => {
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
    backgroundColor: 'white',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 25,
    paddingHorizontal: 20,
    marginHorizontal: 20,
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
    top: -8,
    right: 0,
    padding: 4,
    borderRadius: 8
  },
  columnContainer: {
    gap: 10,
    flexDirection: 'column',
    alignItems: 'center'
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
  fieldWrapper: { flexDirection: 'row', justifyContent: 'center' },
  fieldNameText: {
    opacity: 0.6,
    fontWeight: '600',
    fontSize: 16
  },
  fieldValueText: { opacity: 0.4, fontSize: 16 }
});
