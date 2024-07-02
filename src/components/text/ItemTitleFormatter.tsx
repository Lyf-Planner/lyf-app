import { StyleSheet, Text } from 'react-native';
import { ListItem } from '../../utils/abstractTypes';
import { ItemType } from 'schema/database/items';

type Props = {
  item: ListItem;
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
    fontSize: 19,
    fontFamily: "Lexend",
    padding: 2,
    flex: 1
  }
});
