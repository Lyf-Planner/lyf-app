import { Pressable, StyleSheetProperties, TouchableHighlight } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming
} from 'react-native-reanimated';
import { LyfElement } from 'utils/abstractTypes';

export type BouncyPressableOptions = {
  useTouchableHighlight?: boolean,
  withShadow?: boolean,
  disabled?: boolean;
  containerStyle?: Object;
  conditionalStyles?: Object;
}

type ShadowOptions = {
  shadowOptions?: {
    shadowOffset: number
  }
}

type Props = BouncyPressableOptions & ShadowOptions & {
  children: LyfElement;
  style?: Object;
  onPress?: () => void;
  onLongPress?: () => void;
}

export const BouncyPressable = ({
  children,
  style,
  disabled,
  containerStyle,
  conditionalStyles,
  onPress,
  onLongPress,
  useTouchableHighlight = false,
  withShadow,
  shadowOptions
}: Props) => {
  const WrappingPressable = useTouchableHighlight
  ? TouchableHighlight
  : Pressable;

  const scale = useSharedValue(1);
  const scaleAnimation = useAnimatedStyle(() => {
    return {
      transform: [
        {
          scale: withTiming(scale.value, {
            duration: 200
          })
        }
      ]
    } as any;
  });

  const shadowOffsetX = useSharedValue(shadowOptions?.shadowOffset || 3);
  const shadowOffsetY = useSharedValue(shadowOptions?.shadowOffset || 3);
  const shadowAnimation = useAnimatedStyle(() => ({
    shadowOffset: { 
      width: withTiming(shadowOffsetX.value, { duration: 150 }), 
      height: withTiming(shadowOffsetY.value, { duration: 150 })
    },
  }));
  const shadowStyle = {
    shadowColor: 'black',
    shadowOpacity: 0.5,
    shadowRadius: 1
  }

  const animatedStyle = [scaleAnimation, containerStyle];
  if (withShadow) {
    animatedStyle.push(shadowAnimation, shadowStyle)
  }

  return (
    <Animated.View style={animatedStyle}>
      <WrappingPressable
        onPress={onPress}
        disabled={disabled}
        onLongPress={onLongPress}
        onPressIn={() => {
          scale.value = 0.9
          shadowOffsetX.value = 0.5;
          shadowOffsetY.value = 0.5;
        }}
        onPressOut={() => {
          shadowOffsetX.value = shadowOptions?.shadowOffset || 3;
          shadowOffsetY.value = shadowOptions?.shadowOffset || 3;
          scale.value = 1;
        }}
        underlayColor={'rgba(0,0,0,0.5)'}
        style={[style, conditionalStyles]}
      >
        {children}
      </WrappingPressable>
    </Animated.View>
  );
};
