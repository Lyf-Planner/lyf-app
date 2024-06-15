import { ListItemUnderlay } from './ItemUnderlay';
import { useDrawer } from '../../../providers/useDrawer';
import { SharedValue, useSharedValue } from 'react-native-reanimated';
import { ListItemGestureWrapper } from './ItemGestureWrapper';
import { ListItemOverlay } from './ItemOverlay';
import { useTimetable } from '../../../providers/useTimetable';
import { LocalItem } from 'schema/items';
import { ItemDrawer } from '../ItemDrawer';

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
  item: LocalItem;
  itemStyleOptions: ItemStyleOptions;
  fromNote: boolean;
};

export const Item = ({
  item,
  itemStyleOptions,
}: Props) => {
  const { updateDrawer } = useDrawer();
  const { updateItem, removeItem } = useTimetable();

  // UTILS

  const openModal = async () => {
    const invitedRoutineInstantiation = item.invite_pending && item.template_id;
    updateDrawer(undefined);
    // Create any localised items for drawer to find
    if (item.localised && !invitedRoutineInstantiation) {
      // TODO: Review invitedRoutineInstantiation
      await updateItem(item.id, item);
    }

    updateDrawer(
      <ItemDrawer
        // Invites to templates should open the template!
        item={item}
        updateItem={updateItem}
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
      invited={item.invite_pending}
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
