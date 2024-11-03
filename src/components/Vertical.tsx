import { View } from "react-native";

export const Vertical = ({ style = {} }) => {
  return (
    <View
      style={[
        {
          borderLeftWidth: 0.5
        },
        style
      ]}
    />
  );
};
