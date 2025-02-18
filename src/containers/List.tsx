import { useEffect, useMemo, useRef, useState } from 'react';
import { View, StyleSheet } from 'react-native';

import DraggableFlatlist, { RenderItemParams } from 'react-native-draggable-flatlist';

import { ItemStyleOptions, Item } from '@/containers/Item';
import { ListMultiAction } from '@/containers/ListMultiAction';
import { SortableListItem } from '@/containers/SortableListItem';
import { ItemType } from '@/schema/database/items';
import { LocalItem } from '@/schema/items';
import { useTimetableStore } from '@/store/useTimetableStore';
import { LyfElement } from '@/utils/abstractTypes';

interface Props {
  fixedType?: ItemType;
  items: LocalItem[];
  itemStyleOptions: ItemStyleOptions;
  listWrapperStyles?: object;
  newItemContext: Partial<LocalItem>;
  sortingTrigger?: { activate: boolean };
}

type DragEndProps = {
  data: LocalItem[],
  from: number,
  to: number,
}

enum States {
  DEFAULT,
  EDIT
}

export const List = ({
  fixedType,
  items,
  itemStyleOptions,
  listWrapperStyles = {},
  newItemContext,
  sortingTrigger
}: Props) => {
  const { resortItems } = useTimetableStore();

  const isNoteList = useMemo(() => items.some((item) => !!item.note_id), [items]);
  const listItems = useMemo(() => items.sort((a, b) => {
    // Note items use the default sorting rank
    if (isNoteList) {
      return (a.default_sorting_rank ?? 0) - (b.default_sorting_rank ?? 0)
    } else {
      return a.sorting_rank - b.sorting_rank
    }
  }), [items]);

  const [state, setState] = useState<States>(States.DEFAULT);

  const isFirstRender = useRef(true);
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    if (sortingTrigger) {
      setState(sortingTrigger.activate ? States.EDIT : States.DEFAULT);
    }
  }, [sortingTrigger])

  const onDragEnd = ({ data: items }: DragEndProps) => {
    resortItems(items, isNoteList);
  };

  const conditionalStyles = {
    main: {
      gap: listItems.length > 0 ? 8 : 0
    }
  }

  const stateMap: Record<States, LyfElement> = {
    [States.DEFAULT]: (
      <View style={[styles.listContainer, listWrapperStyles]}>
        {listItems.map((x) => (
          <Item
            key={x.id}
            itemStyleOptions={itemStyleOptions}
            item={x}
          />
        ))}
      </View>
    ),
    [States.EDIT]: (
      <DraggableFlatlist
        containerStyle={[styles.listContainer, listWrapperStyles]}
        contentContainerStyle={styles.contentContainerStyle}
        autoscrollThreshold={100}
        style={styles.flatlistInternal}
        data={listItems}
        onDragEnd={onDragEnd}
        keyExtractor={(item: LocalItem) => item.id + item.sorting_rank + item.default_sorting_rank}
        renderItem={(x: RenderItemParams<LocalItem>) => {
          return (
            <SortableListItem
              key={(x.item.template_id || x.item.id) + x.item.sorting_rank + x.item.default_sorting_rank}
              itemStyleOptions={itemStyleOptions}
              item={x.item}
              dragFunc={x.drag}
            />
          );
        }}
      />
    )
  }

  return (
    <View style={[styles.main, conditionalStyles.main]}>
      {stateMap[state]}
      <ListMultiAction
        fixedType={fixedType}
        newItemContext={{
          ...newItemContext,
          sorting_rank: listItems.length
        }}
        editActiveTrigger={sortingTrigger}
        editCallback={() => setState(States.EDIT)}
        editDoneCallback={() => setState(States.DEFAULT)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  main: {
    flexDirection: 'column',
    width: '100%'
  },
  contentContainerStyle: { gap: 1 },
  flatlistInternal: {
    flexDirection: 'column',
    overflow: 'visible'
  },
  listContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 1,
    width: '100%'
  }
});
