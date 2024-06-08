import { Pressable, TouchableHighlight } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming
} from 'react-native-reanimated';

export const BouncyPressable = ({
  children,
  style = {},
  disabled = false,
  containerStyle = null,
  conditionalStyles = null,
  onPress = null,
  onLongPress = null,
  useTouchableHighlight = false
}) => {
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

  const WrappingPressable = useTouchableHighlight
    ? TouchableHighlight
    : Pressable;

  return (
    <Animated.View style={[scaleAnimation, containerStyle]}>
      <WrappingPressable
        onPress={onPress}
        disabled={disabled}
        onLongPress={onLongPress}
        onPressIn={() => {
          scale.value = 0.9;
        }}
        onPressOut={() => {
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
