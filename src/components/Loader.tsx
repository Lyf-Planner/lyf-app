import * as Progress from 'react-native-progress';

export const Loader = ({ size = 50, color = 'black' }) => {
  return <Progress.Pie color={color} size={size} indeterminate />;
};
