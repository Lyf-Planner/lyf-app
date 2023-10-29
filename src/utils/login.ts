import { get } from "./axios";
import { formatDateData } from "./dates";
import { storeAsyncData } from "./asyncStorage";
import env from "../envManager";

export async function login(username: string, password: string) {
  var local = new Date();
  var sent_time = formatDateData(local);

  var url = `${env.BACKEND_URL}/login?user_id=${username}&password=${password}&local_date=${sent_time}`;

  var result = await get(url);
  if (result.status === 200) {
    storeAsyncData("token", result.data.token);
    return result.data.user;
  } else if ((result.status = 429)) {
    alert(
      "New account was created from this IP too quickly. Please wait 30 seconds"
    );
  } else {
    console.log(result);
    alert("Incorrect password");
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
