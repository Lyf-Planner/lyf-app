import { get, post } from './_axios';
import { storeAsyncData } from '../utils/asyncStorage';
import { getCalendars } from 'expo-localization';
import env from '../envManager';
import { User } from '../schema/user';
import { FriendshipAction } from '../schema/util/social';
import { ID } from 'schema/database/abstract';
import { Notification } from 'schema/notifications';

export const USER_NOT_FOUND = 'Not found';

const usersEndpoint = (req: string) => `/users/${req}`;

export async function login(username: string, password: string) {
  const endpoint = usersEndpoint(`login?user_id=${username}&password=${password}`)
  const result = await get(endpoint);

  if (result?.status === 200) {
    storeAsyncData('token', result.data.token);
    return result.data.user;
  } else if (result?.status === 404) {
    return USER_NOT_FOUND;
  } else if (result?.status === 429) {
    alert('Suspicioius login behaviour. Please wait at least 3 seconds between attempts');
  } else {
    alert('Incorrect password');
  }
}

export async function autologin() {
  const endpoint = usersEndpoint('autologin');

  const result = (await get(endpoint)) as any;
  if (result?.status === 200) {
    return result.data;
  } else {
    return null;
  }
}

export async function saveUser(changes: Partial<User>) {
  const endpoint = usersEndpoint('update')

  const result = await post(endpoint, changes);

  if (result?.status === 200) {
    return true;
  } else {
    // These posts may be unsuccessful often, as when the app closes this gets called frequently,
    // and the server throttles the requests - most of the time not actually an issue!
    console.error(`Issue saving user data, server returned ${result?.status}`);
    alert(JSON.stringify(result.data));
    return false;
  }
}

export async function createUser(username: string, password: string) {
  const endpoint = usersEndpoint('create');
  const body = {
    user_id: username,
    password,
    tz: getCalendars()[0].timeZone || 'Australia/Melbourne'
  };

  const result = await post(endpoint, body);
  if (result?.status === 201) {
    await storeAsyncData('token', result.data.token);
    return result.data.user;
  } else if (result?.status === 400) {
    // While login and creation come from the same function, this won't (shouldn't) happen
    alert('This username is already taken. Maybe try another?');
  } else if (result?.status === 429) {
    alert('Account creation rate is limited to 30 seconds. Please wait');
  }
}

export async function deleteMe(password: string) {
  const endpoint = usersEndpoint('delete')

  const result = await post(endpoint, { password });
  if (result?.status === 204) {
    return true;
  } else {
    alert(result.data);
  }
}

export async function getUser(user_id: string, include: string) {
  const endpoint = usersEndpoint(`get?user_id=${user_id}&include=${include}`)

  const result = await get(endpoint);
  // We use this to check result is a user and not an error object
  if (result?.status === 200) {
    return result.data;
  } else {
    alert(result.data);
  }
}

export async function getNotifications(limit: number) {
  const endpoint = usersEndpoint(`notifications?limit=${limit}`)

  const result = await get(endpoint);
  // We use this to check result is a user and not an error object
  if (result?.status === 200) {
    return result.data;
  } else {
    alert(result.data);
  }
}

export async function updateNotification(id: ID, changes: Partial<Notification>) {
  const endpoint = usersEndpoint(`updateNotification`)

  const result = await post(endpoint, {
    id,
    ...changes
  });
  // We use this to check result is a user and not an error object
  if (result?.status === 200) {
    return result.data;
  } else {
    alert(result.data);
  }
}

export async function updateFriendship(
  user_id: string,
  action: FriendshipAction
) {
  const endpoint = usersEndpoint('updateFriendship')
  const body = {
    user_id,
    action
  };

  const result = await post(endpoint, body);
  if (result?.status === 200) {
    return result.data;
  } else {
    alert(result.data);
  }
}
