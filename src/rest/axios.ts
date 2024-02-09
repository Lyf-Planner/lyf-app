import { getAsyncData } from "../utils/asyncStorage";
import Axios from "axios";

// Get request
export async function get(url: string) {
  try {
    var token = await getAsyncData("token");
    return await Axios.get(url, {
      headers: { Authorization: `Bearer ${token}` },
    });
  } catch (err) {
    console.log(err);
    return err;
  }
}

// Post request
export async function post(url: string, body) {
  try {
    var token = await getAsyncData("token");
    return await Axios.post(url, body, {
      headers: { Authorization: `Bearer ${token}` },
    });
  } catch (err) {
    console.log(err);
    return err;
  }
}
