import { View, Text, StyleSheet } from 'react-native';
import { NoteType } from 'schema/database/notes';
import { black, eventsBadgeColor, primaryGreen, white } from 'utils/colours';

const TYPES_TO_COLOR = Object.freeze({
  "Multiple": primaryGreen,
  "List Only": eventsBadgeColor,
  "Note Only": white,
});

const TYPES_TO_TEXT = Object.freeze({
  "Multiple": white,
  "List Only": black,
  "Note Only": black
});

export const TYPE_TO_DISPLAY_NAME = Object.freeze({
  "Multiple": "Multi",
  "Note Only": "Text",
  "List Only": "List"
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
      <Text style={[styles.main, styles.text]}>
        {TYPE_TO_DISPLAY_NAME[type]}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  main: {
    flexDirection: 'row',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 20
  },
  text: {
    fontSize: 15,
  }
});
