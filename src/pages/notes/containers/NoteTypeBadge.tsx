import { View, Text, StyleSheet } from 'react-native';
import { NoteType } from 'schema/database/notes';
import { black, eventsBadgeColor, primaryGreen, white } from 'utils/colours';

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
  "Note Only": "🗒 Text",
  "List Only": "🖊️ List"
})

type Props = {
  type: NoteType
}

export const NoteTypeBadge = ({ type }: Props) => {
  const conditionalStyles = {
    main: { backgroundColor: TYPES_TO_COLOR[type] },
    text: { color: TYPES_TO_TEXT[type] }
  }

  return (
    <View style={[styles.main, conditionalStyles.main]}>
      <Text style={[conditionalStyles.text, styles.text]}>
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
    borderRadius: 20,
    width: 90
  },
  text: {
    fontSize: 18,
    fontFamily: 'Lexend',
    paddingVertical: 8,
    paddingHorizontal: 8,
  }
});
