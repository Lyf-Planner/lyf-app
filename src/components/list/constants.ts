import { LocalItem } from 'schema/items';
import { eventsBadgeColor, offWhite, primaryGreen, white } from '../../utils/colours';
import { ItemType } from 'schema/database/items';

export enum ItemStatus {
  Cancelled = 'Cancelled',
  Tentative = 'Tentative',
  Upcoming = 'Upcoming',
  InProgress = 'In Progress',
  Done = 'Done',
}

export const StatusOptions = Object.values(ItemStatus);

export const tentativeColor = 'rgb(254 240 138)';
export const upcomingColor = 'rgb(235,235,235)';
export const todoColor = 'rgb(226 232 240)';
export const inProgressColor = 'rgb(56 189 248)';
export const doneColor = primaryGreen;
export const cancelledColor = 'rgb(252 165 165)';

export const ITEM_STATUS_TO_COLOR = {
  // Values taken from the corresponding bg's in tailwind
  Tentative: tentativeColor,
  Upcoming: eventsBadgeColor,
  'To Do': todoColor,
  'In Progress': inProgressColor,
  Done: doneColor,
  Cancelled: cancelledColor
} as any;

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
      return type === ItemType.Event ? 'Cancelled' : "Won't Do";
    default:
      return status;
  }
};

export const isTemplate = (item: LocalItem) => {
  return item.day && !item.date;
};
