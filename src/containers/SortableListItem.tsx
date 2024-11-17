import { useMemo } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { useSharedValue } from 'react-native-reanimated';

import { AnimatedCheck } from '@/components/AnimatedCheck';
import { CollaborativeIcon } from '@/components/CollaborativeIcon';
import { ItemTimeFormatter } from '@/components/ItemTimeFormatter';
import { ItemTitleFormatter } from '@/components/ItemTitleFormatter';
import { SortingHandle } from '@/components/SortingHandle';
import { Vertical } from '@/components/Vertical';
import { ItemStyleOptions } from '@/containers/Item';
import { ItemStatus, ItemType } from '@/schema/database/items';
import { LocalItem } from '@/schema/items';
import { deepBlue, primaryGreen } from '@/utils/colours';
import {
  getItemPrimaryColor,
  getItemSecondaryColor
} from '@/utils/item';

type Props = {
  item: LocalItem;
  itemStyleOptions: ItemStyleOptions;
  dragFunc: () => void;
};

export const SortableListItem = ({
  item,
  itemStyleOptions,
  dragFunc
}: Props) => {
  const checkScale = useSharedValue(1);
  const checkRotation = useSharedValue('0deg');
  const primaryColor = useMemo(
    () => getItemPrimaryColor(item),
    [item, itemStyleOptions]
  );
  const secondaryColor = useMemo(
    () => getItemSecondaryColor(item, itemStyleOptions.itemTextColor),
    [item, itemStyleOptions]
  );

  const conditionalStyles = {
    listItem: {
      backgroundColor: primaryColor,
      borderRadius: item.type === ItemType.Event ? 5 : 15,
      opacity: item.status === ItemStatus.Cancelled || item.invite_pending ? 0.7 : 1
    },
    sortHandleIconColor:
      item.status === ItemStatus.Done ? primaryGreen : 'white'
  };

  return (
    <Pressable
      style={[styles.listItem, conditionalStyles.listItem]}
      onPressIn={() => dragFunc()}
      onLongPress={() => dragFunc()}
    >
      <AnimatedCheck
        item={item}
        checkScale={checkScale}
        checkRotation={checkRotation}
        color={secondaryColor}
      />

      <ItemTitleFormatter item={item} textColor={secondaryColor} />

      {item.time && (
        <View style={styles.listItemTimeSection}>
          <Vertical style={styles.diagLines} />
          <ItemTimeFormatter item={item} textColor={secondaryColor} />
        </View>
      )}

      {item.collaborative && <CollaborativeIcon item={item} />}

      <SortingHandle
        disabled
        backgroundColor={secondaryColor}
        iconColor={conditionalStyles.sortHandleIconColor}
      />
    </Pressable>
  );
};

const styles = StyleSheet.create({
  diagLines: {
    borderColor: deepBlue,
    borderLeftWidth: 2,
    height: '150%',
    marginLeft: 8,
    opacity: 0.2,
    transform: [{ rotateZ: '-20deg' }]
  },
  listItem: {
    alignItems: 'center',
    borderWidth: 1,
    flexDirection: 'row',
    flex: 1,
    gap: 4,
    height: 55,
    maxHeight: 55,
    minHeight: 55,
    padding: 10,
    width: '100%'
  },
  listItemTimeSection: {
    alignItems: 'center',
    flexDirection: 'row',
    height: '100%',
    justifyContent: 'flex-end',
    marginLeft: 'auto',
    minWidth: '30%'
  }
});
