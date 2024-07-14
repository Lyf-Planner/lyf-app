import { get } from './axios';
import { storeAsyncData } from '../utils/asyncStorage';
import env from '../envManager';

export const USER_NOT_FOUND = 'Not found';

const usersEndpoint = (req: string) => `/users/${req}`;

export async function login(username: string, password: string) {
  const endpoint = usersEndpoint(`login?user_id=${username}&password=${password}`)
  const result = await get(endpoint);

  if (result?.status === 200) {
    storeAsyncData('token', result.data.token);
    return result.data.user;
  } else if (result?.status === 404) {
    alert('User not found');
  } else if (result?.status === 429) {
    alert('Please wait 3 seconds between login attempts');
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
