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
      color: textColor,
      fontWeight: item.type === ItemType.Event ? '300' : '200' as "300" | "200" // Idk throws an error without this
    }
  };

  const determineDisplayedText = () => {

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
    fontSize: 18,
    fontFamily: "Lexend",
    padding: 2,
    flex: 1
  }
});
