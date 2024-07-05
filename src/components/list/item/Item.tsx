import { ListItemUnderlay } from './ItemUnderlay';
import { useDrawer } from 'providers/overlays/useDrawer';
import { SharedValue, useSharedValue } from 'react-native-reanimated';
import { ListItemGestureWrapper } from './ItemGestureWrapper';
import { ListItemOverlay } from './ItemOverlay';
import { useTimetable } from 'providers/cloud/useTimetable';
import { LocalItem } from 'schema/items';
import { ItemDrawer } from '../ItemDrawer';

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
  const { updateDrawer, updateSheetMinHeight } = useDrawer();
  const { updateItem, removeItem } = useTimetable();

  // UTILS

  const openModal = async () => {
    const invitedRoutineInstantiation = item.invite_pending && item.template_id;
    updateDrawer(undefined);
    // Create any localised items for drawer to find
    if (item.localised && !invitedRoutineInstantiation) {
      // TODO: Review invitedRoutineInstantiation
      await updateItem(item, {});
    }

    updateDrawer(
      <ItemDrawer
        // Invites to templates should open the template!
        id={item.id}
        updateDrawer={updateDrawer}
        updateSheetMinHeight={updateSheetMinHeight}
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
