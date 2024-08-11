import { useAuth } from 'providers/cloud/useAuth';
import {
  View,
  Text,
  Alert,
  StyleSheet
} from 'react-native';
import { TouchableHighlight } from 'react-native-gesture-handler';
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
    flexDirection: 'row',
    justifyContent: 'center',
    borderWidth: 0.5,
    padding: 10,
    alignItems: 'center',
    gap: 4,
    borderRadius: 5
  },
  logoutText: {
    fontSize: 18,
    fontWeight: '700'
  },
  deleteText: {
    fontSize: 18,
    color: 'white',
    fontFamily: 'Lexend',
    fontWeight: '700',
  },
  deleteView: {
    backgroundColor: 'red'
  }
});
