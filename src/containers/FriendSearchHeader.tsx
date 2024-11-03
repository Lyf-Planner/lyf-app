import { useEffect, useRef, useState } from 'react';
import { Pressable, TextInput, TouchableOpacity, StyleSheet } from 'react-native';

import { Loader } from 'components/Loader';
import AntDesign from 'react-native-vector-icons/AntDesign';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { getUser } from 'rest/user';
import { PublicUser } from 'schema/user';
import { primaryGreen, white } from 'utils/colours';

type Props = {
  searched: boolean,
  setSearchedUser: (user: PublicUser) => void,
  setSearched: (searched: boolean) => void,
}

export const SearchHeader = ({
  searched,
  setSearchedUser,
  setSearched
}: Props) => {
  const [searching, setSearching] = useState(false);
  const [username, setUsername] = useState('');
  const [focussed, setFocussed] = useState(false);
  const textRef = useRef<any>();

  const findUser = async () => {
    setSearching(true);
    const user = await getUser(username, '');
    if (!user) {
      setSearched(true);
    }
    setSearchedUser(user);
    setSearching(false);
  };

  const clearSearch = () => {
    setUsername('');
    textRef.current.focus()
  }

  useEffect(() => {
    // Any change to username should imply it has not been searched
    if (searched) {
      setSearched(false);
    }
  }, [username]);

  const conditionalStyles = {
    searchBarPressable: {
      borderColor: focussed ? 'white' : 'black'
    }
  }

  return (
    <Pressable
      style={[styles.searchBarPressable, conditionalStyles.searchBarPressable]}
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
        onChangeText={setUsername}
        onSubmitEditing={findUser}
        onFocus={() => setFocussed(true)}
        onBlur={() => setFocussed(false)}
        autoCapitalize="none"
        autoComplete="off"
        autoCorrect={false}
      />

      {username &&
        <TouchableOpacity style={styles.cancelSearch} onPress={clearSearch}>
          <AntDesign name="close" color={primaryGreen} size={18} />
        </TouchableOpacity>
      }
    </Pressable>
  )
};

const styles = StyleSheet.create({
  cancelSearch: {
    backgroundColor: white,
    borderRadius: 20,
    marginLeft: 'auto',
    marginRight: 6,
    padding: 2
  },
  searchBarPressable: {
    alignItems: 'center',
    backgroundColor: primaryGreen,
    flexDirection: 'row',
    gap: 12,
    height: 60,
    paddingHorizontal: 20,

    shadowColor: black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 2,
    zIndex: 50
  },
  searchInput: { color: white, fontFamily: 'Lexend', fontSize: 22, padding: 4 }
});
