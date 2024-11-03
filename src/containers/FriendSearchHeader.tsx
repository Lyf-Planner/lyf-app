import { Loader } from "components/Loader";
import { useEffect, useRef, useState } from "react";
import { Pressable, TextInput, TouchableOpacity, StyleSheet } from "react-native";
import AntDesign from "react-native-vector-icons/AntDesign";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import { getUser } from "rest/user";
import { PublicUser } from "schema/user";
import { primaryGreen, white } from "utils/colours";

type Props = {
  searched: boolean,
  setSearchedUser: (user: PublicUser) => void,
  setSearched: (searched: boolean) => void,
}

export const SearchHeader = ({
  searched,
  setSearchedUser,
  setSearched,
}: Props) => {
  const [searching, setSearching] = useState(false);
  const [username, setUsername] = useState('');
  const [focussed, setFocussed] = useState(false);
  const textRef = useRef<any>();

  const findUser = async () => {
    setSearching(true);
    const user = await getUser(username, "");
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
  searchBarPressable: {
    zIndex: 50,
    flexDirection: 'row',
    gap: 12,
    alignItems: 'center',
    height: 60,
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
});
