import { View } from 'react-native';

export const Horizontal = ({ style = {} }) => {
  return (
    <View
      style={[
        {
          borderBottomWidth: 0.5
        },
        style
      ]}
    />
  );
};
