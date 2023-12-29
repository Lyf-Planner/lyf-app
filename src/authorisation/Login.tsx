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
import { USER_NOT_FOUND, login } from "../rest/auth";
import { createUser } from "../rest/user";

export const Login = ({ updateUser }) => {
  const [uid, updateUid] = useState("");
  const [pass, updatePass] = useState("");
  const [loggingIn, updateLoggingIn] = useState(false);
  const [creating, updateCreating] = useState(false);

  const passRef = useRef<any>();

  return (
    <TouchableWithoutFeedback
      style={styles.touchableWithoutFeedback}
      onPress={() => Keyboard.dismiss()}
    >
      <View style={styles.page}>
        <View style={styles.container}>
          <View style={styles.headerContainer}>
            {loggingIn || creating ? (
              <View style={styles.loader}>
                <Loader size={30} />
                <Text style={styles.loaderText}>
                  {loggingIn ? "Fetching your Lyf..." : "Creating your Lyf..."}
                </Text>
              </View>
            ) : (
              <View style={styles.headerTextContainer}>
                <Text style={styles.loginText}>Login</Text>
                <Text style={styles.registerDisclaimer}>
                  Entering new details will create a new account!
                </Text>
              </View>
            )}
          </View>

          <View
            style={[
              styles.fieldContainer,
              { opacity: loggingIn || creating ? 0.5 : 1 },
            ]}
          >
            <TextInput
              style={styles.fields}
              autoCapitalize="none"
              autoCorrect={false}
              returnKeyType="next"
              inputMode="text"
              placeholder="Username"
              value={uid}
              onChangeText={(text) => updateUid(text)}
              onSubmitEditing={() => passRef.current.focus()}
              blurOnSubmit={false}
            />
            <Horizontal style={styles.fieldSeperator} />
            <TextInput
              style={styles.fields}
              returnKeyType="done"
              ref={passRef}
              placeholder="Password"
              autoCorrect={false}
              value={pass}
              secureTextEntry
              onChangeText={(text) => updatePass(text)}
              onSubmitEditing={async () => {
                updateLoggingIn(true);
                var user = await login(uid, pass);
                if (user === USER_NOT_FOUND) {
                  console.log("Creating new account!");
                  updateCreating(true);
                  updateLoggingIn(false);
                  user = await createUser(uid, pass);
                  updateCreating(false);
                }
                updateLoggingIn(false);
                updateUser(user);
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
    maxWidth: 400,
    borderRadius: 15,
    padding: 15,
    alignItems: "center",
    zIndex: 10,
  },
  headerContainer: {
    marginBottom: 14,
    height: 45,
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },
  loader: {
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    gap: 6,
  },
  loaderText: { fontSize: 14, color: "rgba(0,0,0,0.5)", fontWeight: "500" },
  loginText: {
    fontSize: 25,
  },
  headerTextContainer: {
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    gap: 3,
  },
  registerDisclaimer: { fontSize: 12, color: "rgba(0,0,0,0.3)" },

  fieldContainer: {
    flexDirection: "column",
    backgroundColor: "rgb(203 213 225)",
    borderWidth: 1,
    borderColor: "black",
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 2,
    width: "100%",
  },
  fieldSeperator: {
    borderColor: "rgba(0,0,0,0.5)",
  },
  fields: {
    marginVertical: 8,
    fontSize: 18,
  },
});
