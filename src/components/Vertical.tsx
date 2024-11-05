import { StyleSheet, View } from 'react-native';

export const Vertical = ({ style = {} }) => {
  return (
    <View
      style={[
        styles.defaultStyle,
        style
      ]}
    />
  );
};

const styles = StyleSheet.create({
  defaultStyle: {
    borderLeftWidth: 0.5
  }
})
