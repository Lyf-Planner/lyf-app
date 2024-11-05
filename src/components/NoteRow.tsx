import { SyntheticEvent, useEffect, useRef } from 'react';
import { StyleSheet, View, Text, Platform, Alert } from 'react-native';

import { BouncyPressable } from 'components/BouncyPressable';
import { NoteTypeBadge } from 'components/NoteTypeBadge';
import { useNotes } from 'hooks/cloud/useNotes';
import {
  Directions,
  Gesture,
  TouchableHighlight
} from 'react-native-gesture-handler';
import Animated, {
  useAnimatedStyle,
  useSharedValue
} from 'react-native-reanimated';
import Entypo from 'react-native-vector-icons/Entypo';
import { UserRelatedNote } from 'schema/user';
import { black, blackWithOpacity, deepBlueOpacity, eventsBadgeColor, white } from 'utils/colours';

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

  // Web Right Click detection
  //
  //   React Native won't recognise that we're performing this on a div,
  //   it doesn't actually support div or any html as a built in type.
  //   However on web, that's precisely what it transpiles to,
  //   and is precisely what we want to manipulate on web only.
  //   This is typed as div (despite the error) so the reader knows exactly what gets manipulated in HTML.
  //
  // @ts-expect-error react native does not directly support html types
  const wrapperRef = useRef<div>(null);

  useEffect(() => {
    const handleContextMenu = (event: SyntheticEvent) => {
      event.preventDefault();
      handleDeletion();
    };

    const componentElement = wrapperRef.current;

    if (componentElement && Platform.OS === 'web') {
      componentElement.addEventListener('contextmenu', handleContextMenu);
    }

    // Cleanup event listener on component unmount
    return () => {
      if (componentElement && Platform.OS === 'web') {
        componentElement.removeEventListener('contextmenu', handleContextMenu);
      }
    };
  }, []);

  const handleDeletion = () => {
    if (Platform.OS === 'web') {
      if (confirm(`Are you sure you want to delete ${note.title}`)) {
        removeNote(note.id)
      }
      return;
    }

    Alert.alert(
      `Are you sure you want to delete ${note.title}`,
      undefined,
      [
        { text: 'Cancel', onPress: () => null },
        { text: 'Delete', onPress: () => removeNote(note.id), isPreferred: true }
      ]
    )
  }

  return (
    <BouncyPressable
      onPress={onSelect}
      onLongPress={() => handleDeletion()}
      style={styles.bannerView}
    >
      <View
        style={styles.touchableHighlight}
        ref={wrapperRef}
      >
        <NoteTypeBadge type={note.type} />
        <Text
          adjustsFontSizeToFit
          numberOfLines={1}
          style={styles.titleText}
        >
          {note.title}
        </Text>
        <View style={styles.animatedChevron}>
          <Entypo name={'chevron-right'} size={25} color='white' />
        </View>
      </View>
    </BouncyPressable>
  );
};

const styles = StyleSheet.create({
  animatedChevron: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 4,
    marginLeft: 'auto'
  },
  bannerView: {
    alignItems: 'center',
    backgroundColor: deepBlueOpacity(Platform.OS === 'web' ? 0.9 : 0.75),
    borderColor: blackWithOpacity(0.3),
    borderRadius: 10,
    borderTopWidth: 1,
    flexDirection: 'row',
    height: 60,
    maxWidth: 500,
    shadowColor: black,

    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 1,
    width: '100%'
  },
  titleText: {
    color: eventsBadgeColor,
    fontFamily: 'Lexend',
    fontSize: 20,
    fontWeight: '400',
    maxWidth: '75%',
    overflow: 'hidden'
  },
  touchableHighlight: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 12,
    height: '100%',
    paddingHorizontal: 12,
    width: '100%'
  }
});
