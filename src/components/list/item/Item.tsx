import { ListItemUnderlay } from './ItemUnderlay';
import { useDrawer } from 'providers/overlays/useDrawer';
import { SharedValue, useSharedValue } from 'react-native-reanimated';
import { ListItemGestureWrapper } from './ItemGestureWrapper';
import { ListItemOverlay } from './ItemOverlay';
import { useTimetable } from 'providers/cloud/useTimetable';
import { LocalItem } from 'schema/items';
import { ItemDrawer } from '../ItemDrawer';
import { useState } from 'react';

export type ListItemAnimatedValues = {
  scale: SharedValue<number>;
  offsetX: SharedValue<number>;
  checkScale: SharedValue<number>;
  checkRotation: SharedValue<string>;
};

export type ItemStyleOptions = {
  itemColor?: string;
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
  const { addItem } = useTimetable();
  const [creatingLocalised, setCreatingLocalised] = useState(false);

  // UTILS

  const openModal = async () => {
    updateDrawer(undefined);
    updateDrawer(
      <ItemDrawer
        id={item.id}
      />
    );
  };

  // ANIMATION VALUES

  const animatedValues: ListItemAnimatedValues = {
    scale: useSharedValue(1),
    offsetX: useSharedValue(0),
    checkScale: useSharedValue(1),
    checkRotation: useSharedValue('0deg'),
  };

  return (
    <ListItemGestureWrapper
      item={item}
      invited={item.invite_pending}
      animatedValues={animatedValues}
      openModal={openModal}
      setCreatingLocalised={setCreatingLocalised}
    >
      <ListItemOverlay
        item={item}
        animatedValues={animatedValues}
        itemStyleOptions={itemStyleOptions}
      />
      <ListItemUnderlay 
        drawerLoading={creatingLocalised}
        item={item} 
      />
    </ListItemGestureWrapper>
  );
};
