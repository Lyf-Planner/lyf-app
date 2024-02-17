export enum DaysOfWeek {
  Monday = "Monday",
  Tuesday = "Tuesday",
  Wednesday = "Wednesday",
  Thursday = "Thursday",
  Friday = "Friday",
  Saturday = "Saturday",
  Sunday = "Sunday",
}

export const DaysList = Object.values(DaysOfWeek);

export const primaryGreen = "rgb(21, 128, 61)";
export const secondaryGreen = "rgb(34 197 94)"; // brighter one
export const eventsBadgeColor = "rgb(191 219 254)";
export const deepBlue = "rgb(30 41 59)";
export const deepBlueOpacity = (a: number) => `rgba(30, 41, 59, ${a})`;
export const offWhite = "rgba(0,0,0,0.02)";
export const appleGray = "rgb(235,235,235)";

export enum UserListContext {
  Friends = "Friends",
  Item = "Item",
}

export enum FriendshipAction {
  Remove = "Remove",
  Accept = "Accept",
  Decline = "Decline",
  Request = "Request",
  Cancel = "Cancel",
}

export enum SocialAction {
  Invite = "Invite",
  Cancel = "Cancel",
  Accept = "Accept",
  Decline = "Decline",
  Remove = "Remove",
}

export enum Permission {
  Owner = "Owner",
  Editor = "Editor",
  Viewer = "Viewer",
  Invited = "Invited",
}

export const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
