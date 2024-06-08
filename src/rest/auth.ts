import { get } from './axios';
import { storeAsyncData } from '../utils/asyncStorage';
import env from '../envManager';

export const USER_NOT_FOUND = 'Not found';

export async function login(username: string, password: string) {
  const url = `${env.BACKEND_URL}/login?user_id=${username}&password=${password}`;

  const result = await get(url);
  if (result?.status === 200) {
    storeAsyncData('token', result.data.token);
    return result.data.user;
  } else if (result?.status === 404) {
    return USER_NOT_FOUND;
  } else if (result?.status === 429) {
    alert('Please wait 3 seconds between login attempts');
  } else {
    alert('Incorrect password');
  }
}

export async function autologin() {
  const url = `${env.BACKEND_URL}/autoLogin`;

  const result = (await get(url)) as any;
  if (result?.status === 200) {
    return result.data;
  } else {
    return null;
  }
}
