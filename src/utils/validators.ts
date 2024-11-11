import { Alert } from 'react-native';

export const validateUsername = (username: string) => {
  console.log('VALIDATING USERNAME:', username.match(/[^a-zA-Z0-9._]/gi));
  if (username.match(/[^a-zA-Z0-9._]/gi)) {
    Alert.alert(
      'Try Again',
      'Username must only contain alphanumericals, underscores or fullstops'
    );
    return false;
  }

  if (username.length > 20) {
    Alert.alert('Try Again', 'Username must be less than 20 characters');
    return false;
  }

  return true;
};

export const validatePassword = (password: string) => {
  if (password.length < 8) {
    Alert.alert('Try Again', 'Password must be at least 8 characters');
    return false;
  }

  return true;
};

export const validateDisplayName = (name: string) => {
  if (name.length > 25) {
    Alert.alert('Try Again', 'Name must be less than 25 characters');
    return false;
  }

  return true;
};
