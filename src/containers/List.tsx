import { useCallback, useEffect, useState } from 'react';
import { View, StyleSheet } from 'react-native';

import { ItemStyleOptions, Item } from '@/containers/Item';
import { ListMultiAction } from '@/containers/ListMultiAction';
import { SortableList } from '@/containers/SortableList';
import { ItemType } from '@/schema/database/items';
import { LocalItem } from '@/schema/items';
import { useTimetableStore } from '@/store/useTimetableStore';

type Props = {
  fixedType?: ItemType;
  items: LocalItem[];
  itemStyleOptions: ItemStyleOptions;
  listWrapperStyles?: object;
  newItemContext: Partial<LocalItem>;
};

export const List = ({
  fixedType,
  items,
  itemStyleOptions,
  listWrapperStyles = {},
  newItemContext
}: Props) => {
  const { resortItems } = useTimetableStore();

  // TODO LYF-651:
  // Need to localise "sorted" behaviour to the list
  // At the moment this is handled upstream, and only DayDisplay does it properly.
  // ListDropdown and Note Lists do not sort properly
  const [sorting, setSorting] = useState(false);
  const [sortOrder, setSortOrder] = useState<LocalItem[]>(items);

  const submitSortOrder = useCallback(() => {
    resortItems(sortOrder);
  }, [sortOrder]);

  useEffect(() => {
    if (!sorting && sorting !== null) {
      // If a timeout is not set, this runs before the bounce animation finishes
      // Due to threading (I think) the animation gets stuck halfway through
      setTimeout(() => submitSortOrder(), 100);
    }
  }, [sorting]);

  useEffect(() => {
    setSortOrder(items);
  }, [items]);

  const conditionalStyles = {
    main: {
      gap: items.length === 0 ? 0 : 8
    }
  }

  return (
    <View style={[styles.main, conditionalStyles.main]}>
      {sorting ? (
        <SortableList
          setSortOrder={setSortOrder}
          sortOrder={sortOrder}
          itemStyleOptions={itemStyleOptions}
          listWrapperStyles={listWrapperStyles}
        />
      ) : (
        <View style={[styles.listContainer, listWrapperStyles]} key={items.map((x) => x.id).join()}>
          {sortOrder.map((x) => (
            <Item
              key={x.id}
              itemStyleOptions={itemStyleOptions}
              item={x}
            />
          ))}
        </View>
      )}

      <ListMultiAction
        fixedType={fixedType}
        newItemContext={{
          ...newItemContext,
          sorting_rank: items.length
        }}
        editCallback={() => setSorting(true)}
        editDoneCallback={() => setSorting(false)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  main: {
    flexDirection: 'column',
    width: '100%'
  },
  listContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 1,
    width: '100%'
  }
});
