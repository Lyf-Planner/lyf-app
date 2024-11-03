import { useAuth } from 'hooks/cloud/useAuth';
import { View, TouchableHighlight, Text, StyleSheet, TouchableOpacity } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { primaryGreen, white } from 'utils/colours';

export const LogoutButton = () => {
  const { logout } = useAuth();

  return (
    <TouchableOpacity onPress={logout} style={styles.touchable}>
      <View style={styles.buttonView}>
        <Text style={styles.logoutText}>Logout</Text>
        <MaterialCommunityIcons name="logout" size={20} color='white' />
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  touchable: {
    borderRadius: 5,

    shadowColor: 'black',
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 2
  },
  buttonView: {
    flexDirection: 'row',
    backgroundColor: primaryGreen,
    justifyContent: 'center',
    borderWidth: 0.5,
    padding: 10,
    alignItems: 'center',
    gap: 4,
    borderRadius: 5
  },
  logoutText: {
    fontSize: 18,
    fontWeight: '700',
    fontFamily: 'Lexend',
    color: 'white'
  }
});
