import { View, StyleSheet } from 'react-native';

export const Horizontal = ({ style = {} }) => {
  return (
    <View
      style={[
        styles.main,
        style
      ]}
    />
  );
};

const styles = StyleSheet.create({
  main: {
    borderBottomWidth: 0.5
  }
})
