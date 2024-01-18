import { StyleSheet, View, Text, TouchableOpacity } from "react-native";
import {
  Directions,
  Gesture,
  GestureDetector,
  TouchableHighlight,
} from "react-native-gesture-handler";
import { Horizontal } from "../../components/MiscComponents";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { NoteTypeBadge } from "./NoteTypeBadge";
import { useNotes } from "../../hooks/useNotes";
import Entypo from "react-native-vector-icons/Entypo";

export const NoteBanner = ({ id, title, noteType, onPress }) => {
  const { removeNote } = useNotes();
  const offsetX = useSharedValue(0);

  const flingLeft = Gesture.Fling()
    .direction(Directions.LEFT)
    .runOnJS(true)
    .onEnd(() => (offsetX.value = -55));
  const flingRight = Gesture.Fling()
    .direction(Directions.RIGHT)
    .runOnJS(true)
    .onEnd(() => (offsetX.value = 0));
  const composed = Gesture.Exclusive(flingLeft, flingRight);

  const flingAnimation = useAnimatedStyle(
    () =>
      ({
        transform: [
          {
            translateX: withTiming(offsetX.value, {
              duration: 200,
            }),
          },
        ],
        zIndex: 50,
      } as any)
  );

  return (
    <View style={[styles.main]}>
      <TouchableOpacity
        style={[styles.bannerHiddenBackground]}
        onPress={() => removeNote(id)}
      >
        <Entypo name="trash" style={styles.editIcon} size={20} color="white" />
      </TouchableOpacity>

      <Animated.View style={[styles.bannerView, flingAnimation]}>
        <GestureDetector gesture={composed}>
          <TouchableHighlight
            underlayColor={"rgb(150,150,150)"}
            onPress={onPress}
          >
            <View style={styles.touchableHighlight}>
              <Text style={[styles.titleText]}>{title}</Text>
              <View style={[styles.animatedChevron]}>
                <NoteTypeBadge type={noteType} />

                <Entypo name={"chevron-right"} size={25} />
              </View>
            </View>
          </TouchableHighlight>
        </GestureDetector>
      </Animated.View>

      <Horizontal
        style={{
          opacity: 0.1,
          borderBottomWidth: 0.5,
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  main: {
    width: "100%",
    overflow: "hidden",
    zIndex: -5,
  },
  bannerView: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    height: 55,
  },
  bannerHiddenBackground: {
    height: 54.9,
    right: 0,
    flexDirection: "row",
    alignItems: "center",
    position: "absolute",
    zIndex: -1,
    backgroundColor: "red",
    width: 55,
  },
  touchableHighlight: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    height: "100%",
    paddingLeft: 6,
    paddingRight: 15,
  },
  titleText: {
    fontSize: 20,
    color: "rgba(0,0,0,0.75)",
    fontWeight: "400",
  },
  editIcon: { marginLeft: "auto", marginRight: 17.5 },
  animatedChevron: {
    marginLeft: "auto",
    flexDirection: "row",
  },
});
