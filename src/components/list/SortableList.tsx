import { View, StyleSheet, Text } from 'react-native';
import DraggableFlatlist, { RenderItemParams } from 'react-native-draggable-flatlist';
import { useTimetable } from 'providers/cloud/useTimetable';
import { secondaryGreen } from '../../utils/colours';
import { SortableListItem } from './item/SortableListItem';
import { ItemStyleOptions } from './item/Item';
import { Identifiable } from 'schema/database/abstract';
import { LocalItem } from 'schema/items';

type Props = {
  items: LocalItem[];
  itemStyleOptions: ItemStyleOptions;
  listWrapperStyles?: Object;
};

type DragEndProps = {
  data: LocalItem[],
  from: number,
  to: number,
}

export const SortableList = ({
  items,
  itemStyleOptions,
  listWrapperStyles = {}
}: Props) => {
  const { resortItems } = useTimetable();

  const onDragEnd = ({ data, from, to }: DragEndProps) => {
    resortItems(data, to);
  };

  console.log('item order', items.map(({ title, sorting_rank }) => ({ title, sorting_rank })))

  const renderItem = (x: RenderItemParams<LocalItem>) => {
    return (
      <SortableListItem
        key={x.item.template_id || x.item.id}
        itemStyleOptions={itemStyleOptions}
        item={x.item}
        dragFunc={x.drag}
        isActive={x.isActive}
      />
    );
  };

  return (
    <DraggableFlatlist
      containerStyle={[styles.listContainer, listWrapperStyles]}
      contentContainerStyle={{ gap: 2 }}
      style={styles.flatlistInternal}
      data={items}
      onDragEnd={onDragEnd}
      keyExtractor={(item: LocalItem) => item.id}
      renderItem={renderItem}
    />
  );
};

const styles = StyleSheet.create({
  listContainer: {
    overflow: 'visible',
    width: '100%',
    gap: 8
  },
  flatlistInternal: { 
    flexDirection: 'column',
    overflow: 'visible',
    gap: 4,
  },
  
});
