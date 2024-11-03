import { StyleSheet } from 'react-native';
import DraggableFlatlist, { RenderItemParams } from 'react-native-draggable-flatlist';
import { SortableListItem } from 'containers/SortableListItem';
import { ItemStyleOptions } from 'containers/Item';
import { LocalItem } from 'schema/items';
import { Dispatch, SetStateAction } from 'react';

type Props = {
  setSortOrder: Dispatch<SetStateAction<LocalItem[]>>;
  sortOrder: LocalItem[];
  itemStyleOptions: ItemStyleOptions;
  listWrapperStyles?: Object;
};

type DragEndProps = {
  data: LocalItem[],
  from: number,
  to: number,
}

export const SortableList = ({
  setSortOrder,
  sortOrder,
  itemStyleOptions,
  listWrapperStyles = {}
}: Props) => {
  const onDragEnd = ({ data, from, to }: DragEndProps) => {
    setSortOrder(data);
  };

  const renderItem = (x: RenderItemParams<LocalItem>) => {
    return (
      <SortableListItem
        key={x.item.template_id || x.item.id}
        itemStyleOptions={itemStyleOptions}
        item={x.item}
        dragFunc={x.drag}
      />
    );
  };

  return (
    <DraggableFlatlist
      containerStyle={[styles.listContainer, listWrapperStyles]}
      contentContainerStyle={{ gap: 1 }}
      autoscrollThreshold={100}
      style={styles.flatlistInternal}
      data={sortOrder}
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
  },
  flatlistInternal: { 
    flexDirection: 'column',
    overflow: 'visible',
  },
  
});
