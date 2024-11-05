import { View, Text, StyleSheet } from 'react-native';

import { Loader } from 'components/Loader';
import { white } from 'utils/colours';

export const LoadingScreen = ({ text }: { text: string}) => {
  return (
    <View style={styles.loadingScreenContainer}>
      <Text style={styles.loadingText}>{text}</Text>
      <Loader color="white" size={60} />
    </View>
  );
};

const styles = StyleSheet.create({
  loadingScreenContainer: {
    alignContent: 'center',
    alignItems: 'center',
    flex: 1,
    gap: 25,
    justifyContent: 'center'
  },
  loadingText: { color: white, fontFamily: 'Lexend', fontSize: 16 }
});
