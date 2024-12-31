import { ID } from '@/schema/database/abstract';
import { ItemDbObject, ItemType, ItemStatus } from '@/schema/database/items';
import { Permission } from '@/schema/database/items_on_users';
import { LocalItem } from '@/schema/items';
import { UserRelatedItem } from '@/schema/user';
import { SocialAction } from '@/schema/util/social';
import { cancelledColor, doneColor, eventsBadgeColor, inProgressColor, tentativeColor, todoColor, white } from '@/utils/colours';

export const StatusOptions = Object.values(ItemStatus);

export type ItemDrawerProps = {
  item: LocalItem,
  updateItem: UpdateItem,
  updateDrawer: (drawer: JSX.Element | null) => void;
  updateSheetMinHeight: (height: number) => void;
}

export type AddItem = (
  type: ItemType,
  rank: number,
  initial: Partial<LocalItem>,
) => Promise<ID>;

export type AddToStore = (
  item: UserRelatedItem,
  localised?: boolean
) => void;

export type UpdateItem = (item: LocalItem, changes: Partial<UserRelatedItem>, updateRemote?: boolean) => Promise<void>;

export type UpdateItemSocial = (
  item: LocalItem,
  user_id: string,
  action: SocialAction,
  permission: Permission
) => Promise<void>;

export type RemoveItem = (item: LocalItem, deleteRemote?: boolean) => Promise<void>;

export type ResortItems = (priorities: LocalItem[]) => void;

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
