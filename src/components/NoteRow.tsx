import { SyntheticEvent, useEffect, useMemo, useRef } from 'react';
import { StyleSheet, View, Text, Platform, Alert } from 'react-native';

import Entypo from 'react-native-vector-icons/Entypo';
import FontAwesome5Icon from 'react-native-vector-icons/FontAwesome5';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import { CollaborativeIcon } from '@/components/CollaborativeIcon';
import { NoteTypeBadge } from '@/components/NoteTypeBadge';
import { SortingHandle } from '@/components/SortingHandle';
import { LyfMenu } from '@/containers/LyfMenu';
import { NoteDbObject, NoteType } from '@/schema/database/notes';
import { UserRelatedNote } from '@/schema/user';
import { useNoteStore } from '@/store/useNoteStore';
import { black, blackWithOpacity, deepBlue, deepBlueOpacity, eventsBadgeColor } from '@/utils/colours';

type Props = {
  note: NoteDbObject,
  parent: UserRelatedNote | null,
  onDrag?: () => void;
  onSelect: () => void;
}

export const NoteRow = ({
  note,
  parent,
  onDrag,
  onSelect
}: Props) => {
  const { moving, sorting, moveNote, removeNote, setSorting, setMoving } = useNoteStore();
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

  const canBeMovedTo = useMemo(() => {
    return note.type === NoteType.Folder && moving !== note.id;
  }, [note.type, moving])

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

    const noteIsFolder = note.type === NoteType.Folder;
    Alert.alert(
      'Are you sure?',
      noteIsFolder ? `This will also delete all contents of '${note.title}'` : 'This operation cannot be reversed',
      [
        {
          text: 'Cancel',
          onPress: () => null,
          isPreferred: false
        },
        {
          text: 'Confirm',
          onPress: () => removeNote(note.id),
          isPreferred: true
        }
      ],
      { cancelable: true }
    );
  }

  const conditionalStyles = {
    main: {
      ...(!canBeMovedTo && moving !== note.id && moving ? {
        opacity: 0.5
      } : {}),

      ...(canBeMovedTo && moving ? {
        backgroundColor: deepBlueOpacity(0.9),
        borderWidth: 0.5,
        borderColor: eventsBadgeColor,
        shadowOffset: { width: 0, height: 0 },
        shadowRadius: 3,
        shadowOpacity: 1
      } : {})
    }
  }

  return (
    <LyfMenu
      onPress={onDrag || onSelect}
      useHold={!!onDrag}
      options={[{
        icon: <MaterialCommunityIcons name="delete" size={22} />,
        text: 'Delete',
        onSelect: !moving ? () => handleDeletion() : () => null,
        style: moving ? { opacity: 0.5 } : {}
      }, {
        icon: <MaterialCommunityIcons name="folder-move" size={22} />,
        text: 'Move',
        onSelect: moving
          ? () => moveNote(moving, note.id)
          : () => setMoving(note.id, parent ? parent.id : 'root')
      }, {
        icon: <FontAwesome5Icon name="sort" size={22} />,
        text: 'Sort',
        onSelect: !moving ? () => setSorting(!sorting) : () => null,
        style: moving ? { opacity: 0.5 } : {}
      }]}
      pressableOptions={{
        containerStyle: [styles.main, conditionalStyles.main]
      }}
      disabled={!!moving && !canBeMovedTo}
      useLongPress
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
        {sorting && (
          <View style={styles.rowLeft}>
            <SortingHandle
              disabled
              backgroundColor={eventsBadgeColor}
              iconColor={deepBlue}
            />
          </View>
        )}

        {!sorting && (
          <View style={styles.rowLeft}>
            {note.collaborative && <CollaborativeIcon entity={note} type='note' />}
            <Entypo name={'chevron-right'} size={25} color='white' />
          </View>
        )}
      </View>
    </LyfMenu>
  );
};

const styles = StyleSheet.create({
  main: {
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
  rowLeft: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 4,
    marginLeft: 'auto'
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
