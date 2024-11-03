import {
  TouchableHighlight,
  View,
  Text,
  Alert,
  StyleSheet
} from 'react-native';

import { useAuth } from 'hooks/cloud/useAuth';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

export const DeleteButton = () => {
  const { deleteMe, logout } = useAuth();

  return (
    <TouchableHighlight
      onPress={() => {
        Alert.prompt(
          'Confirm Deletion',
          'Please re-enter your password to confirm account deletion',
          async (pass) => {
            const success = await deleteMe(pass);
            if (success) {
              logout();
            }
          }
        );
      }}
    >
      <View style={[styles.buttonView, styles.deleteView]}>
        <Text style={styles.deleteText}>Delete Account</Text>
        <MaterialCommunityIcons name="delete-circle" size={20} color='white' />
      </View>
    </TouchableHighlight>
  );
};

const styles = StyleSheet.create({
  buttonView: {
    alignItems: 'center',
    alignSelf: 'center',
    borderRadius: 5,
    borderWidth: 0.5,
    flexDirection: 'row',
    gap: 4,
    justifyContent: 'center',
    maxWidth: 400,
    padding: 10,
    width: '100%'
  },
  deleteText: {
    color: white,
    fontFamily: 'Lexend',
    fontSize: 18,
    fontWeight: '700'
  },
  deleteView: {
    backgroundColor: 'red'
  },
  logoutText: {
    fontSize: 18,
    fontWeight: '700'
  }
});
