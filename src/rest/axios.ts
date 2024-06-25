import { getAsyncData } from '../utils/asyncStorage';
import Axios from 'axios';

// Get request
export async function get(url: string) {
  try {
    const token = await getAsyncData('token');
    return await Axios.get(url, {
      headers: { Authorization: `Bearer ${token}` }
    });
  } catch (err) {
    console.log("error", err);
    return err.response;
  }
}

// Post request
export async function post(url: string, body) {
  try {
    const token = await getAsyncData('token');
    return await Axios.post(url, body, {
      headers: { Authorization: `Bearer ${token}` }
    });
  } catch (err) {
    return err.response;
  }
}
