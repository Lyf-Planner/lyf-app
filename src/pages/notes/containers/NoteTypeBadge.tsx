import { View, Text, StyleSheet } from 'react-native';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import { NoteType } from 'schema/database/notes';
import { black, deepBlue, eventsBadgeColor, primaryGreen, white } from 'utils/colours';

const TYPES_TO_COLOR = Object.freeze({
  "Multiple": primaryGreen,
  "List Only": eventsBadgeColor,
  "Note Only": primaryGreen,
});

const TYPES_TO_TEXT = Object.freeze({
  "Multiple": white,
  "List Only": black,
  "Note Only": white
});

export const TYPE_TO_DISPLAY_NAME = Object.freeze({
  "Multiple": "Multi",
  "Note Only": <FontAwesome5 name='sticky-note' size={20} />,
  "List Only": <FontAwesome5 name='list-ul' size={18} />
})

type Props = {
  type: NoteType
}

export const NoteTypeBadge = ({ type }: Props) => {
  return (
    <View style={[styles.main]}>
      <Text style={[styles.text]}>
        {TYPE_TO_DISPLAY_NAME[type]}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  main: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 25,
    backgroundColor: eventsBadgeColor,
    width: 40,
    height: 40
  },
  text: {
    fontSize: 18,
    fontFamily: 'Lexend',
    textAlign: 'center'
  }
});
