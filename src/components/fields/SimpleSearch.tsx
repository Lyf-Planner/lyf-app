import { useRef } from 'react';
import { TextInput, View, StyleSheet } from 'react-native';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';
import { appleGray, primaryGreen, white, whiteWithOpacity } from 'utils/colours';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

type Props = {
  search: string,
  setSearch: (search: string) => void,
}

export const SimpleSearch = ({ search, setSearch }: Props) => {
  const textRef = useRef<any>();

  return (
    <View style={styles.main}>
      <TouchableWithoutFeedback
        style={styles.searchBarPressable}
        onPress={() => textRef.current.focus()}
      >
        <FontAwesome name="search" color="white" size={20} />
        <TextInput
          ref={textRef}
          placeholder='Search Friends...'
          placeholderTextColor={white}
          value={search}
          returnKeyType="done"
          selectionColor={'white'}
          style={styles.searchInput}
          onChangeText={setSearch}
          autoCapitalize="none"
          autoComplete="off"
          autoCorrect={false}
        />
      </TouchableWithoutFeedback>
    </View>
  );
};

const styles = StyleSheet.create({
  main: { flexDirection: 'row', width: '100%' },
  searchBarPressable: {
    flexDirection: 'row',
    width: '100%',
    backgroundColor: primaryGreen,
    borderWidth: 1,
    borderRadius: 10,
    paddingVertical: 6,
    paddingHorizontal: 12,
    alignItems: 'center',
    gap: 4,
    marginHorizontal: 4,

    shadowOffset: { width: 1, height: 1 },
    shadowColor: 'black',
    shadowOpacity: 0.5,
    shadowRadius: 2
  },
  searchInput: { padding: 4, color: 'white', fontSize: 22 },
  loaderWrapper: { marginLeft: 'auto', marginRight: 8 }
});
