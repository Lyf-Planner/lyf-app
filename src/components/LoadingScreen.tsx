import { View, Text, StyleSheet } from 'react-native';

import { Loader } from 'components/Loader';

export const LoadingScreen = ({ text }: { text: string}) => {
  return (
    <View style={styles.loadingScreenContainer}>
      <Text style={{ color: white, fontSize: 16, fontFamily: 'Lexend' }}>{text}</Text>
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
  }
});
