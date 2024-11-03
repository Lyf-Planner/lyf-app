import { StyleSheet, Text } from 'react-native';

import { ItemType } from 'schema/database/items';
import { LocalItem } from 'schema/items';

type Props = {
  item: LocalItem;
  textColor: string;
};

export const ItemTitleFormatter = ({ item, textColor }: Props) => {
  const conditionalStyles = {
    listItemText: {
      color: textColor
    }
  };

  return (
    <Text
      adjustsFontSizeToFit={true}
      numberOfLines={2}
      style={[styles.listItemText, conditionalStyles.listItemText]}
    >
      {item.title}
      {item.location && ` @ ${item.location}`}
    </Text>
  );
};

const styles = StyleSheet.create({
  listItemText: {
    flex: 1,
    fontFamily: 'Lexend',
    fontSize: 16,
    padding: 2
  }
});
