import { ItemDbObject, ItemType, ItemStatus } from '@/schema/database/items';
import { LocalItem } from '@/schema/items';
import { UpdateItem } from '@/shell/cloud/useTimetable';
import { cancelledColor, doneColor, eventsBadgeColor, inProgressColor, tentativeColor, todoColor, white } from '@/utils/colours';

export const StatusOptions = Object.values(ItemStatus);

export type ItemDrawerProps = {
  item: LocalItem,
  updateItem: UpdateItem,
  updateDrawer: (drawer: JSX.Element | undefined) => void;
  updateSheetMinHeight: (height: number) => void;
}

export const ITEM_STATUS_TO_COLOR = {
  // Values taken from the corresponding bg's in tailwind
  Tentative: tentativeColor,
  Upcoming: eventsBadgeColor,
  'To Do': todoColor,
  'In Progress': inProgressColor,
  Done: doneColor,
  Cancelled: cancelledColor
};

// Used by background
export const getItemPrimaryColor = (item: LocalItem, defaultColor?: string) => {
  if (!item.status || item.status === ItemStatus.Upcoming) {
    return defaultColor || (item.type === ItemType.Event ? eventsBadgeColor : white);
  }

  return ITEM_STATUS_TO_COLOR[item.status];
};

// Used by text and icons etc
export const getItemSecondaryColor = (item: LocalItem, defaultColor: string) => {
  if (item.status === ItemStatus.Done) {
    return 'white';
  }
  if (item.status === ItemStatus.InProgress) {
    return 'black';
  }
  if (item.status === ItemStatus.Tentative) {
    return 'black';
  }
  if (item.status === ItemStatus.Cancelled) {
    return 'black';
  } else {
    return defaultColor;
  }
};

export const statusTextDisplay = (type: ItemType, status: ItemStatus) => {
  switch (status) {
    case ItemStatus.Upcoming:
      return type === ItemType.Event ? 'Confirmed' : 'To Do';
    case ItemStatus.Tentative:
      return type === ItemType.Event ? 'Tenative' : 'Maybe';
    case ItemStatus.Cancelled:
      return type === ItemType.Event ? 'Cancelled' : 'Won\'t Do';
    default:
      return status;
  }
};

export const isTemplate = (item: ItemDbObject) => {
  return item.day && !item.date;
};
