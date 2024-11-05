/* eslint-disable @typescript-eslint/no-explicit-any */
import Axios from 'axios';

import env from '@/envManager';
import { getAsyncData } from '@/utils/asyncStorage';

const backendUrl = `${env.BACKEND_URL}/api/v1`

// Get request
export async function get(endpoint: string) {
  try {
    const token = await getAsyncData('token');
    const requestUrl = backendUrl + endpoint;
    console.debug('hitting', requestUrl);

    return await Axios.get(requestUrl, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json;charset=utf-8'
      }
    });
  } catch (err: any) {
    console.debug('error', err);
    return err.response;
  }
}

// Post request
export async function post(endpoint: string, body: unknown) {
  try {
    const token = await getAsyncData('token');
    const requestUrl = backendUrl + endpoint;
    console.log('hitting', requestUrl);

    return await Axios.post(requestUrl, body, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json;charset=utf-8'
      },
      // Prevent undefined values from being stripped by JSON.stringify
      // Otherwise we cannot clear fields via changesets.
      transformRequest: [(data) => JSON.stringify(data, (_k, v) => v === void 0 ? null : v)]
    });
  } catch (err: any) {
    console.error('error', err);
    return err.response;
  }
}
