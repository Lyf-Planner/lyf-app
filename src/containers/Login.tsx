import { useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput
} from 'react-native';

import { Horizontal } from 'components/Horizontal';
import { Loader } from 'components/Loader';
import { USER_NOT_FOUND, login } from 'rest/auth';
import { createUser } from 'rest/user';
import { ExposedUser } from 'schema/user';
import { black, blackWithOpacity, loginFieldBackground, white } from 'utils/colours';
import { validatePassword, validateUsername } from 'utils/validators';

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
      console.log('User not found, creating account')
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

    if (user) {
      updateUser(user);
    }
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
          placeholderTextColor='rgba(0,0,0,0.5)'
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
          placeholderTextColor='rgba(0,0,0,0.5)'
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
    <View
      style={styles.touchableWithoutFeedback}
    >
      <View style={styles.page}>
        <View style={styles.container}>
          {_renderHeader()}
          {_renderFields()}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    backgroundColor: white,
    borderRadius: 15,
    flexDirection: 'column',
    maxWidth: 400,
    padding: 15,
    width: '75%',
    zIndex: 10
  },
  fieldContainer: {
    backgroundColor: loginFieldBackground,
    borderColor: black,
    borderRadius: 10,
    borderWidth: 1,
    flexDirection: 'column',
    paddingHorizontal: 8,
    paddingVertical: 2,
    width: '100%'
  },
  fieldSeperator: {
    borderColor: blackWithOpacity(0.5)
  },
  fields: {
    fontFamily: 'Lexend',
    fontSize: 18,
    fontWeight: '300',
    marginVertical: 8,
    // @ts-expect-error this is a valid web style that doesnt lint well with rn typescript
    outlineStyle: 'none',
    zIndex: 100
  },
  headerContainer: {
    alignItems: 'center',
    flexDirection: 'column',
    height: 45,
    justifyContent: 'center',
    marginBottom: 14
  },
  headerTextContainer: {
    alignItems: 'center',
    flexDirection: 'column',
    gap: 3,
    justifyContent: 'center'
  },
  loader: {
    alignItems: 'center',
    flexDirection: 'column',
    gap: 6,
    justifyContent: 'center'
  },
  loaderText: {
    color: blackWithOpacity(0.5),
    fontFamily: 'Lexend',
    fontSize: 14
  },
  loginText: {
    fontFamily: 'Lexend',
    fontSize: 25
  },
  page: {
    alignItems: 'center',
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',

    shadowColor: black,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 5,
    zIndex: 0
  },
  registerDisclaimer: {
    color: blackWithOpacity(0.3),
    fontFamily: 'Lexend',
    fontSize: 12
  },
  touchableWithoutFeedback: {
    flex: 1,
    zIndex: 50
  }
});
