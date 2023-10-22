import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Keyboard,
  TouchableWithoutFeedback,
} from "react-native";
import { Horizontal, Loader } from "../components/MiscComponents";
import { useRef, useState } from "react";
import { login } from "../utils/login";

export const Login = ({ updateUser }) => {
  const [uid, updateUid] = useState("");
  const [pass, updatePass] = useState("");
  const [loading, updateLoading] = useState(false);

  const passRef = useRef<any>();

  return (
    <TouchableWithoutFeedback
      style={styles.touchableWithoutFeedback}
      onPress={() => Keyboard.dismiss()}
    >
      <View style={styles.page}>
        <View style={styles.container}>
          <View style={styles.headerTextContainer}>
            {loading ? (
              <Loader size={20} />
            ) : (
              <Text style={styles.loginText}>Login</Text>
            )}
          </View>
          <View style={styles.fieldContainer}>
            <TextInput
              style={styles.fields}
              autoCapitalize="none"
              returnKeyType="next"
              inputMode="text"
              placeholder="Username"
              value={uid}
              onChangeText={(text) => updateUid(text)}
              onSubmitEditing={() => passRef.current.focus()}
            />
            <Horizontal />
            <TextInput
              style={styles.fields}
              returnKeyType="done"
              ref={passRef}
              placeholder="Password"
              value={pass}
              secureTextEntry
              onChangeText={(text) => updatePass(text)}
              onSubmitEditing={async () => {
                updateLoading(true);
                var user = await login(uid, pass);
                updateLoading(false);
                user && updateUser(user);
              }}
            />
          </View>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  touchableWithoutFeedback: {
    flex: 1,
    zIndex: 0,
  },
  page: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 0,
  },
  container: {
    backgroundColor: "white",
    flexDirection: "column",
    width: "75%",
    borderRadius: 20,
    padding: 15,
    alignItems: "center",
    zIndex: 10,
  },
  headerTextContainer: {
    marginBottom: 14,
  },
  loginText: {
    fontSize: 25,
  },
  fieldContainer: {
    flexDirection: "column",
    backgroundColor: "rgb(203 213 225)",
    borderWidth: 1,
    borderColor: "black",
    borderRadius: 15,
    paddingHorizontal: 8,
    paddingVertical: 2,
    width: "100%",
  },
  fields: {
    marginVertical: 8,
    fontSize: 18,
  },
});
