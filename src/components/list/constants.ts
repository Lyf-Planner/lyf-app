import { primaryGreen } from "../../utils/constants";

export enum ItemStatus {
  Cancelled = "Cancelled",
  Tentative = "Tentative",
  Upcoming = "Upcoming",
  InProgress = "In Progress",
  Done = "Done",
}

export const StatusOptions = Object.values(ItemStatus);

export const tentativeColor = "rgb(254 240 138)"
export const upcomingColor = "rgb(235,235,235)"
export const todoColor = "rgb(226 232 240)"
export const inProgressColor = "rgb(56 189 248)"
export const doneColor = primaryGreen
export const cancelledColor = "rgb(252 165 165)"

export const ITEM_STATUS_TO_COLOR = {
  // Values taken from the corresponding bg's in tailwind
  Tentative: tentativeColor,
  Upcoming: upcomingColor,
  "To Do": todoColor,
  "In Progress": inProgressColor,
  Done: doneColor,
  Cancelled: cancelledColor,
} as any;

export enum ListItemType {
  Event = "Event",
  Task = "Task",
  Item = "Item",
}

export const statusTextDisplay = (type: ListItemType, status: ItemStatus) => {
  switch (status) {
    case ItemStatus.Upcoming:
      return type === ListItemType.Event ? "Confirmed" : "To Do";
    case ItemStatus.Tentative:
      return type === ListItemType.Event ? "Tenative" : "Maybe";
    case ItemStatus.Cancelled:
      return type === ListItemType.Event ? "Cancelled" : "Won't Do";
    default:
      return status;
  }
};

export const getItemPermission = (item, user_id) => {
  const users = item.permitted_users.concat(item.invited_users || []);
  return users.find((x) => x.user_id === user_id)?.permissions;
};

export const isTemplate = (item) => {
  return item.day && !item.date;
};
