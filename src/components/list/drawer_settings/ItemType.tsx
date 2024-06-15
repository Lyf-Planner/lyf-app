import { StyleSheet, TouchableHighlight, Text } from 'react-native';
import { eventsBadgeColor } from '../../../utils/colours';
import { LocalItem } from 'schema/items';
import { UpdateItem } from 'providers/useTimetable';
import { ItemType } from 'schema/database/items';
import { useCallback } from 'react';
import { ItemDrawerProps } from '../ItemDrawer';

export const ItemTypeBadge = ({ item, updateItem }: ItemDrawerProps) => {
  const switchType = useCallback(() => {
    if (item.invite_pending) {
      return;
    }

    let type;
    if (item.type === ItemType.Task) {
      type = ItemType.Event;
    } else {
      type = ItemType.Task;
    }

    updateItem(item.id, { type });
  }, [item]);

  const conditionalStyles = {
    typeBadge: {
      backgroundColor: item.type === ItemType.Event ? eventsBadgeColor : 'white'
    }
  }

  return (
    <TouchableHighlight
      style={[
        styles.typeBadge,
        conditionalStyles.typeBadge
      ]}
      onPress={switchType}
      underlayColor="rgba(0,0,0,0.5)"
    >
      <Text style={styles.typeText}>{item.type}</Text>
    </TouchableHighlight>
  );
};

const styles = StyleSheet.create({
  typeBadge: {
    marginLeft: 'auto',
    paddingVertical: 6,
    paddingHorizontal: 8,
    borderRadius: 10
  },
  typeText: {
    fontSize: 16,
    fontWeight: '500'
  }
});
