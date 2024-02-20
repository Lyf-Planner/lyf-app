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

export const arraysEqualAsSets = (arr1, arr2) => {
  const a = new Set(arr1);
  const b = new Set(arr2);

  // let a_minus_b = new Set([...a].filter((x) => !b.has(x)));
  // let b_minus_a = new Set([...b].filter((x) => !a.has(x)));

  // console.log("A minus B", ...a_minus_b); // {1}
  // console.log("B minus A", ...b_minus_a); // {5}

  return equalSets(a, b);
};

export const equalSets = (xs, ys) =>
  xs.size === ys.size && [...xs].every((x) => ys.has(x));

export const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
