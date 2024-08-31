import { View, StyleSheet } from 'react-native';
import { ItemStyleOptions, Item } from './item/Item';
import { LocalItem } from 'schema/items';

type Props = {
  items: LocalItem[];
  itemStyleOptions: ItemStyleOptions;
  listWrapperStyles?: Object;
};

export const List = ({
  items,
  itemStyleOptions,
  listWrapperStyles = {},
}: Props) => {
  return (
    <View style={[styles.listContainer, listWrapperStyles]}>
      {items.map((x) => (
        <Item
          key={x.id}
          itemStyleOptions={itemStyleOptions}
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
    gap: 1,
    width: '100%',
  }
});
