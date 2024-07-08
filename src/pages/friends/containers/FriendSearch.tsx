import { useEffect, useRef, useState } from 'react';
import { Pressable, StyleSheet, View, Text } from 'react-native';
import { TextInput } from 'react-native-gesture-handler';
import { Loader } from 'components/general/MiscComponents';
import { getUser } from 'rest/user';
import { UserBanner } from 'components/users/UserBanner';
import { primaryGreen } from 'utils/colours';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { UserList } from 'components/users/UserList';
import { useFriends } from 'providers/cloud/useFriends';
import { BouncyPressable } from 'components/pressables/BouncyPressable';

export const FriendSearch = () => {
  const { friends } = useFriends();


  const [retrievedUser, updateRetrievedUser] = useState<any>();
  const [searching, updateSearching] = useState(false);
  const [searched, updateSearched] = useState(false);
  const [username, updateUsername] = useState('');
  const [focussed, setFocussed] = useState(false);
  const textRef = useRef<any>();

  const findUser = async () => {
    updateSearching(true);
    const user = await getUser(username, "");
    if (!user) {
      updateSearched(true);
    }
    updateRetrievedUser(user);
    updateSearching(false);
  };

  useEffect(() => {
    // If the username changes, we cannot say we searched
    searched && updateSearched(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [username]);

  return (
    <View style={styles.main}>
      <Text style={styles.hintText}>Ask your friends for their usernames!</Text>
      <BouncyPressable
        style={[styles.searchBarPressable, { borderColor: focussed ? 'white' : 'black'}]}
        onPress={() => textRef.current.focus()}
        bounceScale={0.95}
      >
        <FontAwesome name="search" color="white" size={24} />
        <TextInput
          ref={textRef}
          value={username}
          returnKeyType='go'
          selectionColor={'white'}
          style={styles.searchInput}
          onChangeText={updateUsername}
          onSubmitEditing={findUser}
          onFocus={() => setFocussed(true)}
          onBlur={() => setFocussed(false)}
          autoCapitalize="none"
          autoComplete="off"
          autoCorrect={false}
        />
        {searching && (
          <View style={styles.loaderWrapper}>
            <Loader size={25} color="white" />
          </View>
        )}
        {searched && <Text style={styles.notFoundText}>Not found</Text>}
      </BouncyPressable>
      {retrievedUser && <UserBanner user={retrievedUser} />}
      <UserList 
        users={friends} 
        emptyText={"No friends added yet... 😎"}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  main: { flexDirection: 'column', gap: 10 },
  searchBarPressable: {
    flexDirection: 'row',
    backgroundColor: primaryGreen,
    borderWidth: 1,
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 14,
    alignItems: 'center',
    gap: 7,

    shadowColor: 'black',
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 1
  },
  searchInput: { padding: 4, color: 'white', fontSize: 22 },
  loaderWrapper: { marginLeft: 'auto', marginRight: 8 },
  notFoundText: {
    color: 'white',
    fontSize: 16,
    marginLeft: 'auto',
    marginRight: 4
  },
  hintText: {
    width: '100%',
    textAlign: 'center',
    fontSize: 18,
    marginVertical: 8,
    fontFamily: 'Inter',
    opacity: 0.7,
    fontWeight: '600'
  }
});
