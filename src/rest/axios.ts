import env from 'envManager';
import { getAsyncData } from '../utils/asyncStorage';
import Axios from 'axios';

const backendUrl = `${env.BACKEND_URL}/api/v1`

// Get request
export async function get(endpoint: string) {
  try {
    const token = await getAsyncData('token');
    ;
    return await Axios.get(backendUrl + endpoint, {
      headers: { 
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json;charset=utf-8'
      }
    });
  } catch (err: any) {
    console.log("error", err);
    return err.response;
  }
}

// Post request
export async function post(endpoint: string, body: unknown) {
  try {
    const token = await getAsyncData('token');
    return await Axios.post(backendUrl + endpoint, body, {
      headers: { 
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json;charset=utf-8'
      },
      // Prevent undefined values from being stripped by JSON.stringify
      // Otherwise we cannot clear fields via changesets.
      transformRequest: [data => JSON.stringify(data, (_k, v) => v === void 0 ? null : v)],
    });
  } catch (err: any) {
    return err.response;
  }
}
