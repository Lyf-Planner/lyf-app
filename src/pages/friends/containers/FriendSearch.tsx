import { useEffect, useRef, useState } from 'react';
import { Pressable, StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { TextInput } from 'react-native-gesture-handler';
import { Loader, PageLoader } from 'components/general/MiscComponents';
import { getUser } from 'rest/user';
import { UserBanner } from 'components/users/UserBanner';
import { eventsBadgeColor, primaryGreen, white } from 'utils/colours';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { UserList } from 'components/users/UserList';
import { useFriends } from 'providers/cloud/useFriends';
import { BouncyPressable } from 'components/pressables/BouncyPressable';
import AntDesign from 'react-native-vector-icons/AntDesign';

export const FriendSearch = () => {
  const { friends, loading } = useFriends();

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
  }, [username]);

  return (
    <View style={styles.main}>
      <Pressable
        style={[styles.searchBarPressable, { borderColor: focussed ? 'white' : 'black'}]}
        onPress={() => textRef.current.focus()}
      >
        {searching
          ? <Loader size={23} color="white" />
          : <FontAwesome name="search" color="white" size={25} />
        }
        <TextInput
          ref={textRef}
          value={username}
          returnKeyType='go'
          placeholder='Search Users...'
          placeholderTextColor={'white'}
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

        {username && 
          <TouchableOpacity style={styles.cancelSearch} onPress={() => {
            updateUsername('');
            textRef.current.focus()
          }}>
            <AntDesign name="close" color={primaryGreen} size={18} />
          </TouchableOpacity>
        }
    </Pressable>

      <View style={styles.pageContent}>
        {searched && <Text style={styles.notFoundText}>Not found</Text>}
        {retrievedUser && <UserBanner user={retrievedUser} callback={() => updateRetrievedUser(null)} />}
        
        {!loading && 
          <UserList 
            users={friends.filter((x) => x.id !== retrievedUser?.id)} 
            emptyText={"No friends added yet... 😎"}
            onAction={() => updateRetrievedUser(null)}
          />
        }
        {!loading && 
          <Text style={styles.hintText}>Ask your friends for their usernames!</Text>
        }

        {loading &&
          <PageLoader />
        }
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  main: { flexDirection: 'column', gap: 10 },
  searchBarPressable: {
    zIndex: 50,
    flexDirection: 'row',
    gap: 12,
    alignItems: 'center',
    height: 65,
    paddingHorizontal: 20,

    backgroundColor: primaryGreen, 
    shadowColor: 'black',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 2
  },
  searchInput: { padding: 4, color: 'white', fontSize: 22, fontFamily: 'Lexend' },
  cancelSearch: {
    backgroundColor: white,
    marginLeft: 'auto',
    padding: 2,
    borderRadius: 20,
    marginRight: 6,
  },
  pageContent: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    flexDirection: 'column',
    gap: 8,
  },
  loaderWrapper: { marginLeft: 'auto', marginRight: 8 },
  notFoundText: {
    fontSize: 18,
    fontWeight: '500',
    fontFamily: 'Lexend',
    width: '100%',
    marginTop: 4,
    marginBottom: 8,
    textAlign: 'center'
  },
  hintText: {
    width: '100%',
    textAlign: 'center',
    fontSize: 18,
    marginVertical: 16,
    fontFamily: 'Inter',
    opacity: 0.5,
    fontWeight: '600'
  }
});
