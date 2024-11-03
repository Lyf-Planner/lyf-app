import { useCallback } from 'react';
import { StyleSheet, TouchableHighlight, Text } from 'react-native';

import { ItemType } from 'schema/database/items';
import { ItemDrawerProps } from 'utils/item';

import { eventsBadgeColor } from '../../utils/colours';

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

    updateItem(item, { type });
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
    borderRadius: 10,
    marginLeft: 'auto',
    paddingHorizontal: 8,
    paddingVertical: 6
  },
  typeText: {
    fontFamily: 'Lexend',
    fontSize: 16
  }
});
