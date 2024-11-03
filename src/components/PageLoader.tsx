import { View, StyleSheet, Text } from 'react-native';

import { Loader } from 'components/Loader';
import { deepBlue } from 'utils/colours';

export const PageLoader = () => {
  return (
    <View style={styles.loadingContainer}>
      <Loader size={50} color={deepBlue} />
      <Text style={styles.loadingText}>
        Organizing...
      </Text>
    </View>
  )
}

const styles = StyleSheet.create({
  loadingContainer: {
    alignItems: 'center',
    flexDirection: 'column',
    gap: 10,
    justifyContent: 'center',
    marginTop: 50
  },
  loadingText: {
    color: deepBlue,
    fontFamily: 'Lexend',
    fontSize: 20
  }
});
