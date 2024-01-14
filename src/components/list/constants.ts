import { eventsBadgeColor, primaryGreen } from "../../utils/constants";

export enum ItemStatus {
  Cancelled = "Cancelled",
  Tentative = "Tentative",
  Upcoming = "Upcoming",
  InProgress = "In Progress",
  Done = "Done",
}

export const EventStatusOptions = Object.values(ItemStatus);
export const TaskStatusOptions = Object.values(ItemStatus);

export const ITEM_STATUS_TO_COLOR = {
  // Values taken from the corresponding bg's in tailwind
  Tentative: "rgb(254 240 138)",
  Upcoming: eventsBadgeColor,
  "To Do": "rgb(226 232 240)",
  "In Progress": "rgb(56 189 248)",
  Done: primaryGreen,
  Cancelled: "rgb(252 165 165)",
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
      return type === ListItemType.Event ? "Tenative" : "Won't Do";
    default:
      return status;
  }
};

export const isTemplate = (item) => {
  return item.day && !item.date;
};
