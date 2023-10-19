import Axios from "axios";

// Get request
export async function get(url: string) {
  try {
    return await Axios.get(url);
  } catch (err) {
    console.log(err);
    return err;
  }
}

// Post request
export async function post(url: string, body: any) {
  return await Axios.post(url, body);
}
