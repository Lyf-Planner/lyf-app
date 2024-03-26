import { useRef } from "react";
import { Pressable, TextInput, View, StyleSheet } from "react-native";
import { appleGray } from "../../utils/constants";
import FontAwesome from "react-native-vector-icons/FontAwesome";

export const SimpleSearch = ({ search, setSearch }) => {
  let textRef = useRef<any>();

  return (
    <View style={styles.main}>
      <Pressable
        style={styles.searchBarPressable}
        onPress={() => textRef.current.focus()}
      >
        {/* 
          // @ts-ignore */}
        <FontAwesome name="search" color="black" size={20} />
        <TextInput
          ref={textRef}
          value={search}
          returnKeyType="done"
          selectionColor={"blackr"}
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
  main: { flexDirection: "row", width: "100%" },
  searchBarPressable: {
    flexDirection: "row",
    width: "100%",
    backgroundColor: appleGray,
    borderWidth: 1,
    borderRadius: 10,
    padding: 6,
    alignItems: "center",
    gap: 4,
    marginHorizontal: 4,
  },
  searchInput: { padding: 4, color: "black", fontSize: 22 },
  loaderWrapper: { marginLeft: "auto", marginRight: 8 },
});
