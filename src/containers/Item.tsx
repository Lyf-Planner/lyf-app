import { useState } from 'react';

import { ListItemOverlay } from 'components/ItemOverlay';
import { ListItemUnderlay } from 'components/ItemUnderlay';
import { ItemDrawer } from 'containers/ItemDrawer';
import { ListItemGestureWrapper } from 'containers/ItemGestureWrapper';
import { NoteItemDrawer } from 'containers/NoteItemDrawer';
import { useDrawer } from 'hooks/overlays/useDrawer';
import { SharedValue, useSharedValue } from 'react-native-reanimated';
import { LocalItem } from 'schema/items';

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
};

export const Item = ({
  item,
  itemStyleOptions
}: Props) => {
  const { updateDrawer } = useDrawer();
  const [creatingLocalised, setCreatingLocalised] = useState(false);

  // UTILS

  const openModal = async () => {
    updateDrawer(undefined);
    updateDrawer(item.note_id ? (
      <NoteItemDrawer
        id={item.id}
        noteId={item.note_id}
      />
    ) : (
      <ItemDrawer
        id={item.id}
      />
    ));
  };

  // ANIMATION VALUES

  const animatedValues: ListItemAnimatedValues = {
    scale: useSharedValue(1),
    offsetX: useSharedValue(0),
    checkScale: useSharedValue(1),
    checkRotation: useSharedValue('0deg')
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
