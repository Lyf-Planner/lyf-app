import { Pressable, StyleSheet, View } from 'react-native';
import {
  getItemPrimaryColor,
  getItemSecondaryColor
} from 'utils/item';
import { deepBlue, primaryGreen } from 'utils/colours';
import { useMemo } from 'react';
import { ItemStyleOptions } from 'containers/Item';
import { AnimatedCheck } from 'components/AnimatedCheck';
import { useSharedValue } from 'react-native-reanimated';
import { ItemTitleFormatter } from 'components/ItemTitleFormatter';
import { SortingHandle } from 'components/SortingHandle';
import { CollaborativeIcon } from 'components/CollaborativeIcon';
import { ItemStatus, ItemType } from 'schema/database/items';
import { LocalItem } from 'schema/items';
import { Vertical } from 'components/Vertical';
import { ItemTimeFormatter } from 'components/ItemTimeFormatter';

type Props = {
  item: LocalItem;
  itemStyleOptions: ItemStyleOptions;
  dragFunc: () => void;
};

export const SortableListItem = ({
  item,
  itemStyleOptions,
  dragFunc,
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
  listItem: {
    flexDirection: 'row',
    width: '100%',
    padding: 10,
    flex: 1,
    minHeight: 55,
    height: 55,
    maxHeight: 55,
    borderWidth: 1,
    gap: 4,
    alignItems: 'center'
  },
  listItemTimeSection: {
    minWidth: '30%',
    flexDirection: 'row',
    height: '100%',
    alignItems: 'center',
    marginLeft: 'auto',
    justifyContent: 'flex-end'
  },
  diagLines: {
    borderColor: deepBlue,
    opacity: 0.2,
    marginLeft: 8,
    height: '150%',
    borderLeftWidth: 2,
    transform: [{ rotateZ: '-20deg' }]
  }
});
