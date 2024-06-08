import { View, StyleSheet, Text } from 'react-native';
import DraggableFlatlist from 'react-native-draggable-flatlist';
import { useItems } from '../../providers/useItems';
import { secondaryGreen } from '../../utils/constants';
import { SortableListItem } from './item/SortableListItem';
import { BouncyPressable } from '../pressables/BouncyPressable';
import { ListItem as ListItemAsType } from '../../utils/abstractTypes';
import { ItemStyleOptions } from './item/ListItem';

type Props = {
  items: ListItemAsType[];
  doneSorting: () => void;
  itemStyleOptions: ItemStyleOptions;
  listWrapperStyles?: Object;
};

export const SortableList = ({
  items,
  doneSorting,
  itemStyleOptions,
  listWrapperStyles = {}
}: Props) => {
  const { resortItems } = useItems();

  const onDragEnd = ({ data }) => {
    resortItems(data.map((x) => x.id));
  };

  const renderItem = (x: ListItemAsType) => {
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
    <View style={styles.main}>
      <DraggableFlatlist
        containerStyle={[styles.listContainer, listWrapperStyles]}
        style={styles.flatlistInternal}
        data={items}
        onDragEnd={onDragEnd}
        keyExtractor={(item: ListItemAsType) => item.id}
        renderItem={renderItem}
      />
      <DoneButton doneSorting={doneSorting} />
    </View>
  );
};

const DoneButton = ({ doneSorting }) => {
  return (
    <BouncyPressable style={styles.doneButton} onPress={doneSorting}>
      <Text style={styles.doneText}>Done</Text>
    </BouncyPressable>
  );
};

const styles = StyleSheet.create({
  main: { gap: 2 },
  listContainer: {
    flexWrap: 'wrap',
    flexDirection: 'row',
    overflow: 'visible',
    width: '100%',
    marginTop: 4,
    padding: 2
  },
  flatlistInternal: { overflow: 'visible' },
  doneButton: {
    height: 55,
    borderRadius: 10,
    backgroundColor: secondaryGreen,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 8,
    width: '100%',
    borderColor: 'rgb(156 163 175)',
    borderWidth: 1
  },
  doneText: {
    fontFamily: 'InterMed',
    fontSize: 17,
    color: 'black',
    fontWeight: 'bold'
  }
});
