import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import {
  Directions,
  Gesture,
  GestureDetector,
  TouchableHighlight
} from 'react-native-gesture-handler';
import { Horizontal } from 'components/general/MiscComponents';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming
} from 'react-native-reanimated';
import { NoteTypeBadge } from './NoteTypeBadge';
import { useNotes } from 'providers/cloud/useNotes';
import Entypo from 'react-native-vector-icons/Entypo';
import { ID } from 'schema/database/abstract';
import { UserRelatedNote } from 'schema/user';
import { deepBlueOpacity, white } from 'utils/colours';

type Props = {
  note: UserRelatedNote,
  onSelect: () => void;
}

export const NoteRow = ({ 
  note,
  onSelect
}: Props) => {
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

  const flingAnimation = useAnimatedStyle(() => ({
    transform: [{
      translateX: withTiming(offsetX.value, { duration: 200 })
    }],
    zIndex: 50
  }));

  return (
    <TouchableHighlight
      underlayColor={'rgb(150,150,150)'}
      onPress={onSelect}
      style={[styles.bannerView]}
    >
      <View style={styles.touchableHighlight}>
        <NoteTypeBadge type={note.type} />
        <Text style={[styles.titleText]}>{note.title}</Text>
        <View style={[styles.animatedChevron]}>
          <Entypo name={'chevron-right'} size={25} color='white' />
        </View>
      </View>
    </TouchableHighlight>
  );
};

const styles = StyleSheet.create({
  bannerView: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: deepBlueOpacity(0.9),
    height: 65,
    borderTopWidth: 1
  },
  bannerHiddenBackground: {
    height: 60,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    position: 'absolute',
    zIndex: -1,
    backgroundColor: 'red',
    width: 60
  },
  touchableHighlight: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    height: '100%',
    paddingHorizontal: 12,
    gap: 12
  },
  titleText: {
    fontSize: 20,
    color: white,
    fontWeight: '400',
    fontFamily: 'Lexend'
  },
  editIcon: { marginLeft: 'auto', marginRight: 17.5 },
  animatedChevron: {
    marginLeft: 'auto',
    flexDirection: 'row',
    gap: 4,
    alignItems: 'center'
  }
});
