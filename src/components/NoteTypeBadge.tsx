import { View, Text, StyleSheet } from 'react-native';

import Entypo from 'react-native-vector-icons/Entypo';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';

import { NoteType } from '@/schema/database/notes';
import { deepBlue, eventsBadgeColor } from '@/utils/colours';

export const TYPE_TO_DISPLAY_NAME: Record<NoteType, JSX.Element> = Object.freeze({
  [NoteType.NoteOnly]: <FontAwesome5 name='sticky-note' size={20} />,
  [NoteType.ListOnly]: <FontAwesome5 name='list-ul' size={18} />,
  [NoteType.Folder]: <Entypo name="folder" size={18} />
})

type Props = {
  type: NoteType
}

export const NoteTypeBadge = ({ type }: Props) => {
  const isFolder = type === NoteType.Folder;

  const conditionalStyles = {
    main: {
      borderWidth: isFolder ? 0.5 : 0
    }
  }

  return (
    <View style={[styles.main, conditionalStyles.main]}>
      <Text style={styles.text}>
        {TYPE_TO_DISPLAY_NAME[type]}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  main: {
    alignItems: 'center',
    backgroundColor: deepBlue,
    borderColor: eventsBadgeColor,
    borderRadius: 25,

    flexDirection: 'row',
    height: 40,
    justifyContent: 'center',
    width: 40
  },
  text: {
    color: eventsBadgeColor,
    fontFamily: 'Lexend',
    fontSize: 18,
    textAlign: 'center'
  }
});
