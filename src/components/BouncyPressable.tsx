import { Pressable } from 'react-native';

import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming
} from 'react-native-reanimated';

import { LyfElement } from '@/utils/abstractTypes';
import { black } from '@/utils/colours';

export type BouncyPressableOptions = {
  withShadow?: boolean,
  bounceScale?: number,
  disabled?: boolean;
  style?: object;
  containerStyle?: object;
  conditionalStyles?: object;
  longPressDuration?: number;
}

type ShadowOptions = {
  shadowOptions?: {
    shadowOffset?: { width: number, height: number },
    shadowOpacity?: number,
    shadowRadius?: number
  }
}

export type BouncyPressableProps = BouncyPressableOptions & ShadowOptions & {
  children: LyfElement;
  onPress?: () => void;
  onPressIn?: () => void;
  onLongPress?: () => void;
}

export const BouncyPressable = ({
  children,
  style,
  disabled,
  containerStyle,
  conditionalStyles,
  longPressDuration,
  onPress,
  onPressIn,
  onLongPress,
  withShadow,
  shadowOptions,
  bounceScale
}: BouncyPressableProps) => {
  const scale = useSharedValue(1);
  const scaleAnimation = useAnimatedStyle(() => ({
    transform: [{
      scale: withTiming(scale.value, {
        duration: 200
      })
    }]
  }));

  const shadowOffsetX = useSharedValue(shadowOptions?.shadowOffset?.width || 3);
  const shadowOffsetY = useSharedValue(shadowOptions?.shadowOffset?.height || 3);
  const shadowAnimation = useAnimatedStyle(() => ({
    shadowOffset: {
      width: withTiming(shadowOffsetX.value, { duration: 150 }),
      height: withTiming(shadowOffsetY.value, { duration: 150 })
    }
  }));
  const shadowStyle = {
    shadowColor: black,
    shadowOpacity: 0.5,
    shadowRadius: 1,
    borderRadius: 10,
    ...shadowOptions
  }

  const animatedStyle = [scaleAnimation, containerStyle];
  if (withShadow) {
    animatedStyle.push(shadowAnimation, shadowStyle)
  }

  return (
    <Animated.View style={animatedStyle}>
      <Pressable
        onPress={onPress}
        disabled={disabled}
        onLongPress={onLongPress}
        delayLongPress={longPressDuration}
        onPressIn={() => {
          if (onPressIn) {
            onPressIn();
          }

          scale.value = bounceScale || 0.9
          shadowOffsetX.value = 0.5;
          shadowOffsetY.value = 0.5;
        }}
        onPressOut={() => {
          shadowOffsetX.value = shadowOptions?.shadowOffset?.width || 3;
          shadowOffsetY.value = shadowOptions?.shadowOffset?.height || 3;
          scale.value = 1;
        }}
        style={[style, conditionalStyles]}
      >
        {children}
      </Pressable>
    </Animated.View>
  );
};
