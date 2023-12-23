import { Pressable, TouchableHighlight } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

export const BouncyPressable = ({
  children,
  style,
  containerStyle = null,
  conditionalStyles = null,
  onPress,
  useTouchableHighlight = false,
}) => {
  const scale = useSharedValue(1);

  const scaleAnimation = useAnimatedStyle(() => {
    return {
      transform: [
        {
          scale: withTiming(scale.value, {
            duration: 200,
          }),
        },
      ],
    } as any;
  });

  var WrappingPressable = useTouchableHighlight
    ? TouchableHighlight
    : Pressable;

  return (
    <Animated.View style={[scaleAnimation, containerStyle]}>
      <WrappingPressable
        onPress={onPress}
        onPressIn={() => {
          scale.value = 0.95;
        }}
        onPressOut={() => {
          scale.value = 1;
        }}
        underlayColor={"rgba(0,0,0,0.5)"}
        style={[style, conditionalStyles]}
      >
        {children}
      </WrappingPressable>
    </Animated.View>
  );
};
