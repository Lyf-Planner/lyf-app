import { getAsyncData } from '../utils/asyncStorage';
import Axios from 'axios';

// Get request
export async function get(url: string) {
  try {
    const token = await getAsyncData('token');
    return await Axios.get(url, {
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
export async function post(url: string, body: unknown) {
  try {
    const token = await getAsyncData('token');
    return await Axios.post(url, body, {
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
