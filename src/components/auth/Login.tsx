import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Keyboard,
  TouchableWithoutFeedback
} from 'react-native';
import { Horizontal, Loader } from '../general/MiscComponents';
import { useRef, useState } from 'react';
import { USER_NOT_FOUND, login } from '../../rest/auth';
import { createUser } from '../../rest/user';
import { validatePassword, validateUsername } from '../../utils/validators';
import { ExposedUser } from 'schema/user';

type Props = {
  updateUser: (changes: Partial<ExposedUser>) => void;
}

export const Login = ({ updateUser }: Props) => {
  const [uid, updateUid] = useState('');
  const [pass, updatePass] = useState('');
  const [loggingIn, updateLoggingIn] = useState(false);
  const [creating, updateCreating] = useState(false);

  const passRef = useRef<any>();

  const onSubmit = async () => {
    updateLoggingIn(true);
    let user = await login(uid, pass);

    if (user === USER_NOT_FOUND) {
      if (!validateUsername(uid) || !validatePassword(pass)) {
        updateLoggingIn(false);
        return;
      }

      // Create new user when valid and not found
      updateCreating(true);
      updateLoggingIn(false);
      user = await createUser(uid, pass);
      updateCreating(false);
    }

    updateLoggingIn(false);
    updateUser(user);
  }

  const conditionalStyles = {
    fieldContainer: { opacity: loggingIn || creating ? 0.5 : 1 }
  }

  const _renderHeader = () => {
    const showAuthStatus = loggingIn || creating;
    const authStatus = loggingIn ? 'Fetching your Lyf...' : 'Creating your Lyf...'

    return (
      <View style={styles.headerContainer}>
        {showAuthStatus ? (
          <View style={styles.loader}>
            <Loader size={30} />
            <Text style={styles.loaderText}>
              {authStatus}
            </Text>
          </View>
        ) : (
          <View style={styles.headerTextContainer}>
            <Text style={styles.loginText}>Login</Text>
            <Text style={styles.registerDisclaimer}>
              New details will create a new account!
            </Text>
          </View>
        )}
      </View>
    );
  }

  const _renderFields = () => {
    return (
      <View
        style={[
          styles.fieldContainer,
          conditionalStyles.fieldContainer
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
          onChangeText={updateUid}
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
          onChangeText={updatePass}
          onSubmitEditing={onSubmit}
        />
      </View>
    )
  }

  return (
    <TouchableWithoutFeedback
      style={styles.touchableWithoutFeedback}
      onPress={Keyboard.dismiss}
    >
      <View style={styles.page}>
        <View style={styles.container}>
          {_renderHeader()}
          {_renderFields()}
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  touchableWithoutFeedback: {
    flex: 1,
    zIndex: 0
  },
  page: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 0
  },
  container: {
    backgroundColor: 'white',
    flexDirection: 'column',
    width: '75%',
    maxWidth: 400,
    borderRadius: 15,
    padding: 15,
    alignItems: 'center',
    zIndex: 10
  },
  headerContainer: {
    marginBottom: 14,
    height: 45,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center'
  },
  loader: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 6
  },
  loaderText: { 
    fontSize: 14, 
    color: 'rgba(0,0,0,0.5)', 
    fontFamily: "Lexend" 
  },
  loginText: {
    fontSize: 25,
    fontFamily: "Lexend"
  },
  headerTextContainer: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 3
  },
  registerDisclaimer: { 
    fontSize: 12, 
    color: 'rgba(0,0,0,0.3)', 
    fontFamily: "Lexend" 
  },
  fieldContainer: {
    flexDirection: 'column',
    backgroundColor: 'rgb(203 213 225)',
    borderWidth: 1,
    borderColor: 'black',
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 2,
    width: '100%'
  },
  fieldSeperator: {
    borderColor: 'rgba(0,0,0,0.5)'
  },
  fields: {
    marginVertical: 8,
    fontSize: 18,
    fontWeight: "300",
    fontFamily: "Lexend"
  }
});
