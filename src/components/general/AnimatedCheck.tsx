import Animated, {
  SharedValue,
  useAnimatedStyle,
  withTiming
} from 'react-native-reanimated';
import { SCALE_MS } from '../list/item/ListItemGestureWrapper';
import { ItemStatus } from '../list/constants';
import { ListItem } from '../../utils/abstractTypes';
import AntDesign from 'react-native-vector-icons/AntDesign';

type Props = {
  item: ListItem;
  checkScale: SharedValue<number>;
  color: string;
};

export const AnimatedCheck = ({ item, checkScale, color }: Props) => {
  const iconType =
    item.status === ItemStatus.Done ? 'checkcircle' : 'checkcircleo';

  const checkScaleAnimation = useAnimatedStyle(() => ({
    transform: [
      {
        scale: withTiming(checkScale.value, {
          duration: SCALE_MS
        })
      }
    ]
  }));

  return (
    <Animated.View style={checkScaleAnimation}>
      <AntDesign name={iconType} color={color} size={18} />
    </Animated.View>
  );
};
