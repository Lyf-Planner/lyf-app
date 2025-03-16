import { Alert } from 'react-native';

import { get } from '@/rest/_axios';
import { ExposedUser } from '@/schema/user';
import { storeAsyncData } from '@/utils/asyncStorage';

export const USER_NOT_FOUND = 'not found';
export const UNAUTHORISED = 'unauthorised';
export type LoginResult = 'not found' | 'unauthorised' | ExposedUser;

const usersEndpoint = (req: string) => `/users/${req}`;

export async function login(username: string, password: string): Promise<LoginResult> {
  const endpoint = usersEndpoint(`login?user_id=${username}&password=${password}`)
  const result = await get(endpoint);

  console.log({ 'result.data': result.data, 'result.status': result.status });

  if (result?.status === 200) {
    storeAsyncData('token', result.data.token);
    return result.data.user;
  } else if (result?.status === 404) {
    return USER_NOT_FOUND;
  } else if (result?.status === 429) {
    Alert.alert('Suspicious login behaviour. Please wait at least 3 seconds between attempts');
    return UNAUTHORISED;
  } else {
    // Status 401 Unauthorized
    Alert.alert('Incorrect password', 'Please try again');
    return UNAUTHORISED;
  }
}

export async function autologin() {
  const endpoint = usersEndpoint('autologin');

  const result = await get(endpoint);
  if (result?.status === 200) {
    return result.data;
  } else {
    return null;
  }
}
