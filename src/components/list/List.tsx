import { View, StyleSheet } from 'react-native';
import { ItemStyleOptions, ListItem } from './item/ListItem';
import { ListItem as ListItemAsType } from '../../utils/abstractTypes';
import { UpdateItem, RemoveItem } from '../../providers/useItems';
import { AddItemByTitle, NewItem } from './NewItem';
import { ListItemType } from './constants';

export enum ListType {
  Event = 'Event',
  Task = 'Task',
  Item = 'Item',
}

type Props = {
  items: ListItemAsType[];
  type: ListItemType;
  itemStyleOptions: ItemStyleOptions;
  addItem: AddItemByTitle;
  updateItem: UpdateItem;
  removeItem: RemoveItem;
  listWrapperStyles?: Object;
  fromNote?: boolean;
};

export const List = ({
  items,
  type,
  itemStyleOptions,
  addItem,
  updateItem,
  removeItem,
  listWrapperStyles = {},
  fromNote = false
}: Props) => {
  return (
    <View style={[styles.listContainer, listWrapperStyles]}>
      {items.map((x) => (
        <ListItem
          key={x.id}
          updateItem={updateItem}
          removeItem={removeItem}
          itemStyleOptions={itemStyleOptions}
          fromNote={fromNote}
          item={x}
        />
      ))}
      <NewItem type={type} addItem={addItem} />
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
