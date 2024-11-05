import Animated, {
  SharedValue,
  useAnimatedStyle,
  withTiming
} from 'react-native-reanimated';
import AntDesign from 'react-native-vector-icons/AntDesign';

import { SCALE_MS } from '@/containers/ItemGestureWrapper';
import { ItemStatus } from '@/schema/database/items';
import { LocalItem } from '@/schema/items';

type Props = {
  item: LocalItem;
  checkScale: SharedValue<number>;
  checkRotation: SharedValue<string>;
  color: string;
};

export const AnimatedCheck = ({ item, checkScale, checkRotation, color }: Props) => {
  const iconType =
    item.status === ItemStatus.Done ? 'checkcircle' : 'checkcircleo';

  const checkScaleAnimation = useAnimatedStyle(() => ({
    transform: [
      {
        scale: withTiming(checkScale.value, {
          duration: SCALE_MS
        })
      },
      {
        rotateZ: withTiming(checkRotation.value, {
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
