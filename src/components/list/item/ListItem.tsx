import { useMemo } from 'react';
import { useAuth } from '../../../authorisation/AuthProvider';
import { ListItemUnderlay } from './ListItemUnderlay';
import { useDrawer } from '../../../providers/useDrawer';
import { SharedValue, useSharedValue } from 'react-native-reanimated';
import { ListItemGestureWrapper } from './ListItemGestureWrapper';
import { ListItemDrawer } from '../ListItemDrawer';
import { ListItemOverlay } from './ListItemOverlay';
import { ListItem as ListItemAsType } from '../../../utils/abstractTypes';
import { RemoveItem, UpdateItem } from '../../../providers/useItems';

export const LIST_ITEM_HEIGHT = 55;

export type ListItemAnimatedValues = {
  scale: SharedValue<number>;
  offsetX: SharedValue<number>;
  checkScale: SharedValue<number>;
};

export type ItemStyleOptions = {
  itemColor: string;
  itemTextColor: string;
};

type Props = {
  item: ListItemAsType;
  itemStyleOptions: ItemStyleOptions;
  updateItem: UpdateItem;
  removeItem: RemoveItem;
  fromNote: boolean;
};

export const ListItem = ({
  item,
  itemStyleOptions,
  updateItem,
  removeItem,
  fromNote = false
}: Props) => {
  const { updateDrawer, updateSheetMinHeight } = useDrawer();
  const { user } = useAuth();
  const invited = useMemo(
    () =>
      item?.invited_users &&
      !!item.invited_users.find((x) => x.user_id === user.id),
    [item.invited_users, user]
  );

  // UTILS

  const openModal = async () => {
    const invitedRoutineInstantiation = invited && item.template_id;
    updateDrawer(null);
    // Create any localised items for drawer to find
    if (item.localised && !invitedRoutineInstantiation) {
      await updateItem(item);
    }

    updateDrawer(
      <ListItemDrawer
        // Invites to templates should open the template!
        item_id={invitedRoutineInstantiation ? item.template_id : item.id}
        closeDrawer={() => updateDrawer(null)}
        updateSheetMinHeight={updateSheetMinHeight}
        preloaded={fromNote ? item : null}
        updatePreloaded={fromNote ? updateItem : null}
      />
    );
  };

  // ANIMATION VALUES

  const animatedValues: ListItemAnimatedValues = {
    scale: useSharedValue(1),
    offsetX: useSharedValue(0),
    checkScale: useSharedValue(1)
  };

  return (
    <ListItemGestureWrapper
      item={item}
      invited={invited}
      animatedValues={animatedValues}
      openModal={openModal}
      updateItem={updateItem}
      removeItem={removeItem}
    >
      <ListItemOverlay
        item={item}
        animatedValues={animatedValues}
        itemStyleOptions={itemStyleOptions}
      />
      <ListItemUnderlay item={item} />
    </ListItemGestureWrapper>
  );
};
