import { StyleSheet, Text } from "react-native";
import { ListItem } from "../../utils/abstractTypes";
import { ListItemType } from "../list/constants";

type Props = {
  item: ListItem;
  textColor: string;
};

export const ItemTitleFormatter = ({ item, textColor }: Props) => {
  const conditionalStyles = {
    listItemText: {
      color: textColor,
      fontFamily: item.type !== ListItemType.Task ? "InterMed" : "Inter",
    },
  };
  
  const determineDisplayedText = () => {
    
  }

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
    fontSize: 17,
    padding: 2,
    flex: 1,
  },
});
