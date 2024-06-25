import { get, post } from './axios';
import { storeAsyncData } from '../utils/asyncStorage';
import { getCalendars } from 'expo-localization';
import env from '../envManager';
import { User } from '../schema/user';
import { FriendshipAction } from '../schema/util/social';

export async function saveUser(changes: Partial<User>) {
  const url = `${env.BACKEND_URL}/user/update`;

  const result = await post(url, changes);

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
  const url = `${env.BACKEND_URL}/user/create`;
  const body = {
    user_id: username,
    password,
    timezone: getCalendars()[0].timeZone
  };

  const result = await post(url, body);
  if (result?.status === 200) {
    console.log('User creation successful', result.data);
    storeAsyncData('token', result.data.token);
    return result.data.user;
  } else if (result?.status === 400) {
    // While login and creation come from the same function, this won't (shouldn't) happen
    alert('This username is already taken. Maybe try another?');
  } else if (result?.status === 429) {
    alert('Account creation rate is limited to 30 seconds. Please wait');
  }
}

export async function deleteMe(password: string) {
  const url = `${env.BACKEND_URL}/user/delete`;

  const result = await post(url, { password });
  if (result?.status === 200) {
    return true;
  } else {
    alert(result.data);
  }
}

export async function getUser(user_id: string, include: string) {
  const url = `${env.BACKEND_URL}/user/get?user_id=${user_id}&include=${include}`;

  const result = await get(url);
  // We use this to check result is a user and not an error object
  if (result?.status === 200) {
    return result.data;
  }
}

export async function updateFriendship(
  user_id: string,
  action: FriendshipAction
) {
  const url = `${env.BACKEND_URL}/user/updateFriendship`;
  const body = {
    user_id,
    action
  };

  const result = await post(url, body);
  if (result?.status === 200) {
    return result.data;
  } else {
    alert(result.data);
  }
}
