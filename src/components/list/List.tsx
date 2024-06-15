import { View, StyleSheet } from 'react-native';
import { ItemStyleOptions, Item } from './item/Item';
import { UpdateItem, RemoveItem } from '../../providers/useTimetable';
import { AddItemByTitle, NewItem } from './NewItem';
import { ItemType } from 'schema/database/items';
import { LocalItem } from 'schema/items';

type Props = {
  items: LocalItem[];
  type: ItemType;
  itemStyleOptions: ItemStyleOptions;
  addItemByTitle: AddItemByTitle;
  listWrapperStyles?: Object;
  fromNote?: boolean;
};

export const List = ({
  items,
  type,
  itemStyleOptions,
  addItemByTitle,
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
      <NewItem type={type} addItemByTitle={addItemByTitle} />
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
