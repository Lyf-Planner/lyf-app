export enum DaysOfWeek {
  Monday = 'Monday',
  Tuesday = 'Tuesday',
  Wednesday = 'Wednesday',
  Thursday = 'Thursday',
  Friday = 'Friday',
  Saturday = 'Saturday',
  Sunday = 'Sunday',
}

export const DaysList = Object.values(DaysOfWeek);

export enum UserListContext {
  Friends = 'Friends',
  Item = 'Item',
}

export enum FriendshipAction {
  Remove = 'Remove',
  Accept = 'Accept',
  Decline = 'Decline',
  Request = 'Request',
  Cancel = 'Cancel',
}

export enum SocialAction {
  Invite = 'Invite',
  Cancel = 'Cancel',
  Accept = 'Accept',
  Decline = 'Decline',
  Remove = 'Remove',
}

export enum Permission {
  Owner = 'Owner',
  Editor = 'Editor',
  Viewer = 'Viewer',
  Invited = 'Invited',
}




