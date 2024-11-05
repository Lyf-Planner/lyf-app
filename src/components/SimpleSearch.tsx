import { useRef } from 'react';
import { Pressable, TextInput, View, StyleSheet } from 'react-native';

import FontAwesome from 'react-native-vector-icons/FontAwesome';

import { appleGray, black, primaryGreen, white, whiteWithOpacity } from '@/utils/colours';

type Props = {
  search: string,
  setSearch: (search: string) => void,
}

export const SimpleSearch = ({ search, setSearch }: Props) => {
  const textRef = useRef<TextInput>(null);

  return (
    <View style={styles.main}>
      <Pressable
        style={styles.searchBarPressable}
        onPress={() => {
          if (textRef.current) {
            textRef.current.focus()
          }
        }}
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
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  main: { flexDirection: 'row', width: '100%' },
  searchBarPressable: {
    alignItems: 'center',
    backgroundColor: primaryGreen,
    borderRadius: 10,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 4,
    marginHorizontal: 4,
    paddingHorizontal: 12,
    paddingVertical: 6,
    shadowColor: black,

    shadowOffset: { width: 1, height: 1 },
    shadowOpacity: 0.5,
    shadowRadius: 2,
    width: '100%'
  },
  searchInput: { color: white, fontSize: 22, padding: 4 }
});
