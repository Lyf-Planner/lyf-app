import { View, Image } from 'react-native';

import { Icon } from '@/assets/images';

type Props = {
  style?: {},
  size: number
}

export const LyfIcon = ({ style = {}, size }: Props) => {
  return (
    <View style={style}>
      <Image source={Icon} alt="logo" style={{ width: size, height: size }} />
    </View>
  );
};
