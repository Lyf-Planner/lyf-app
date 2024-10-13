import { get } from './axios';
import { storeAsyncData } from '../utils/asyncStorage';
import env from '../envManager';
import { Alert } from 'react-native';

export const USER_NOT_FOUND = 'Not found';

const usersEndpoint = (req: string) => `/users/${req}`;

export async function login(username: string, password: string) {
  const endpoint = usersEndpoint(`login?user_id=${username}&password=${password}`)
  const result = await get(endpoint);

  console.log({ "result.data": result.data, "result.status": result.status });

  if (result?.status === 200) {
    storeAsyncData('token', result.data.token);
    return result.data.user;
  } else if (result?.status === 404) {
    return USER_NOT_FOUND;
  } else if (result?.status === 429) {
    Alert.alert('Suspicious login behaviour. Please wait at least 3 seconds between attempts');
  } else {
    // Status 401 Unauthorized
    Alert.alert('Incorrect password');
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
