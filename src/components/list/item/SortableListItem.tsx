import { StyleSheet, View } from 'react-native';
import {
  ItemStatus,
  ListItemType,
  getItemPrimaryColor,
  getItemSecondaryColor
} from '../constants';
import { primaryGreen } from '../../../utils/constants';
import { useMemo } from 'react';
import { useAuth } from '../../../authorisation/AuthProvider';
import { ListItem } from '../../../utils/abstractTypes';
import { ItemStyleOptions } from './ListItem';
import { AnimatedCheck } from '../../general/AnimatedCheck';
import { useSharedValue } from 'react-native-reanimated';
import { ItemTitleFormatter } from '../../text/ItemTitleFormatter';
import { SortingHandle } from '../../general/SortingHandle';
import { CollaborativeIcon } from 'components/general/CollaborativeIcon';

type Props = {
  item: ListItem;
  itemStyleOptions: ItemStyleOptions;
  dragFunc: () => void;
  isActive?: boolean;
};

export const SortableListItem = ({
  item,
  itemStyleOptions,
  dragFunc,
  isActive = false
}: Props) => {
  const { user } = useAuth();
  const invited = useMemo(
    () =>
      item?.invited_users &&
      !!item.invited_users.find((x) => x.user_id === user.id),
    [item.invited_users, user]
  );

  const checkScale = useSharedValue(1);
  const primaryColor = useMemo(
    () => getItemPrimaryColor(item, itemStyleOptions.itemColor),
    [item, itemStyleOptions]
  );
  const secondaryColor = useMemo(
    () => getItemSecondaryColor(item, itemStyleOptions.itemTextColor),
    [item, itemStyleOptions]
  );
  const isCollaborative = useMemo(
    () => item.permitted_users.length > 1 || item.invited_users?.length > 0,
    [item]
  );

  const conditionalStyles = {
    listItem: {
      backgroundColor: primaryColor,
      borderRadius: item.type !== ListItemType.Task ? 5 : 15,
      opacity: item.status === ItemStatus.Cancelled || invited ? 0.7 : 1
    },
    sortHandleIconColor:
      item.status === ItemStatus.Done ? primaryGreen : 'white'
  };

  return (
    <View style={[styles.listItem, conditionalStyles.listItem]}>
      <AnimatedCheck
        item={item}
        checkScale={checkScale}
        color={secondaryColor}
      />

      <ItemTitleFormatter item={item} textColor={secondaryColor} />

      {isCollaborative && <CollaborativeIcon item={item} />}
      <SortingHandle
        dragFunc={dragFunc}
        disabled={isActive}
        backgroundColor={secondaryColor}
        iconColor={conditionalStyles.sortHandleIconColor}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  listItem: {
    flexDirection: 'row',
    width: '100%',
    padding: 10,
    flex: 1,
    height: 55,
    borderWidth: 1,
    gap: 4,
    alignItems: 'center'
  }
});
