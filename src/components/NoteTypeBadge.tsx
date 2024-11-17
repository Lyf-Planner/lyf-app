import { View, Text, StyleSheet } from 'react-native';

import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';

import { NoteType } from '@/schema/database/notes';
import { eventsBadgeColor } from '@/utils/colours';

export const TYPE_TO_DISPLAY_NAME = Object.freeze({
  Multiple: 'Multi',
  'Note Only': <FontAwesome5 name='sticky-note' size={20} />,
  'List Only': <FontAwesome5 name='list-ul' size={18} />
})

type Props = {
  type: NoteType
}

export const NoteTypeBadge = ({ type }: Props) => {
  return (
    <View style={styles.main}>
      <Text style={styles.text}>
        {TYPE_TO_DISPLAY_NAME[type]}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  main: {
    alignItems: 'center',
    backgroundColor: eventsBadgeColor,
    borderRadius: 25,
    flexDirection: 'row',
    height: 35,
    justifyContent: 'center',
    width: 35
  },
  text: {
    fontFamily: 'Lexend',
    fontSize: 18,
    textAlign: 'center'
  }
});
