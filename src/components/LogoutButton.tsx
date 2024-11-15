import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import { useAuthStore } from '@/store/useAuthStore';
import { black, primaryGreen, white } from '@/utils/colours';

export const LogoutButton = () => {
  const { logout } = useAuthStore();

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
  buttonView: {
    alignItems: 'center',
    backgroundColor: primaryGreen,
    borderRadius: 5,
    borderWidth: 0.5,
    flexDirection: 'row',
    gap: 4,
    justifyContent: 'center',
    padding: 10
  },
  logoutText: {
    color: white,
    fontFamily: 'Lexend',
    fontSize: 18,
    fontWeight: '700'
  },
  touchable: {
    borderRadius: 5,

    shadowColor: black,
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 2
  }
});
