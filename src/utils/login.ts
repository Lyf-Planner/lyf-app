import { get, post } from "./axios";
import { formatDateData } from "./dates";
import { storeAsyncData } from "./asyncStorage";
import env from "../envManager";

export const USER_NOT_FOUND = "Not found";

export async function login(username: string, password: string) {
  var url = `${env.BACKEND_URL}/login?user_id=${username}&password=${password}`;

  var result = await get(url);
  if (result.status === 200) {
    storeAsyncData("token", result.data.token);
    return result.data.user;
  } else if (result.status === 404) {
    return USER_NOT_FOUND;
  } else if (result.status === 429) {
    alert("Please wait 3 seconds between login attempts");
  } else {
    alert("Incorrect password");
  }
}

export async function createUser(username: string, password: string) {
  var url = `${env.BACKEND_URL}/createUser`;
  var body = { user_id: username, password };

  var result = await post(url, body);
  if (result.status === 200) {
    storeAsyncData("token", result.data.token);
    return result.data.user;
  } else if (result.status === 400) {
    alert("This username is already taken. Maybe try another?");
  } else if (result.status === 429) {
    alert("Account creation rate is limited to 30 seconds. Please wait");
  }
}

export async function autologin(token: string) {
  var local = new Date();
  var sent_time = formatDateData(local);

  var url = `${env.BACKEND_URL}/autoLogin?token=${token}&local_date=${sent_time}`;

  var result = (await get(url)) as any;
  if (result.status === 200) return result.data;
  else return null;
}
