import { View, StyleSheet } from 'react-native';
import { ItemStyleOptions, Item } from './item/Item';
import { LocalItem } from 'schema/items';

type Props = {
  items: LocalItem[];
  itemStyleOptions: ItemStyleOptions;
  listWrapperStyles?: Object;
  fromNote?: boolean;
};

export const List = ({
  items,
  itemStyleOptions,
  listWrapperStyles = {},
  fromNote = false
}: Props) => {
  return (
    <View style={[styles.listContainer, listWrapperStyles]}>
      {items.map((x) => (
        <Item
          key={x.id}
          itemStyleOptions={itemStyleOptions}
          fromNote={fromNote}
          item={x}
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  listContainer: {
    flexWrap: 'wrap',
    flexDirection: 'row',
    gap: 2,
    width: '100%',
    marginTop: 6,
    padding: 2
  }
});
